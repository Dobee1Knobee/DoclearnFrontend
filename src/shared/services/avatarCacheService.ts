interface CachedAvatar {
  avatarId: string
  userId: string
  blob: Blob
  cachedAt: number
  avatarUrl: string
  expiresAt: number
}

class AvatarCacheService {
  private dbName = "DocLearnAvatarCache"
  private version = 2 // Увеличиваем версию для новой схемы
  private storeName = "avatars"
  private db: IDBDatabase | null = null
  private readonly TTL = 7 * 24 * 60 * 60 * 1000 // 7 дней
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.warn("IndexedDB не поддерживается или недоступен")
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result

        this.db.onerror = (event) => {
          console.error("IndexedDB error:", event)
        }

        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName)
        }

        const store = db.createObjectStore(this.storeName, { keyPath: "avatarId" })
        store.createIndex("userId", "userId", { unique: false })
        store.createIndex("cachedAt", "cachedAt", { unique: false })
        store.createIndex("expiresAt", "expiresAt", { unique: false })
      }
    })

    return this.initPromise
  }

  private async getCachedAvatarData(avatarId: string): Promise<CachedAvatar | null> {
    try {
      if (!this.db) {
        await this.init()
      }

      const transaction = this.db!.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)

      return new Promise<CachedAvatar | null>((resolve, reject) => {
        const request = store.get(avatarId)

        request.onsuccess = () => {
          resolve(request.result || null)
        }

        request.onerror = () => {
          console.error("Failed to get cached avatar data:", request.error)
          reject(request.error)
        }

        setTimeout(() => {
          reject(new Error("IndexedDB operation timeout"))
        }, 5000)
      })
    } catch (error) {
      console.error("Failed to get cached avatar data:", error)
      return null
    }
  }

  private shouldUpdateCache(existingAvatar: CachedAvatar | null, newAvatarUrl: string): boolean {
    if (!existingAvatar) {
      return true // Нет кэша - нужно создать
    }

    const now = Date.now()

    if (existingAvatar.expiresAt < now) {
      return true // Кэш устарел
    }

    if (existingAvatar.avatarUrl !== newAvatarUrl) {
      return true // URL изменился - новый аватар
    }

    return false // Обновление не нужно
  }

  async cacheAvatar(avatarUrl: string, userId: string, avatarId?: string): Promise<void> {
    try {
      if (!this.db) {
        await this.init()
      }

      const finalAvatarId = avatarId || userId
      const existingAvatar = await this.getCachedAvatarData(finalAvatarId)

      if (!this.shouldUpdateCache(existingAvatar, avatarUrl)) {
        console.log("Avatar cache is fresh, skipping update for:", finalAvatarId)
        return
      }

      const response = await this.fetchWithRetry(avatarUrl, 3)
      if (!response.ok) {
        throw new Error(`Failed to fetch avatar: ${response.status}`)
      }

      const blob = await response.blob()

      if (blob.size > 5 * 1024 * 1024) {
        console.warn("Avatar size exceeds 5MB limit")
        return
      }

      if (!blob.type.startsWith("image/")) {
        console.warn("Invalid image type:", blob.type)
        return
      }

      const now = Date.now()
      const cachedAvatar: CachedAvatar = {
        avatarId: finalAvatarId,
        userId,
        blob,
        cachedAt: now,
        avatarUrl,
        expiresAt: now + this.TTL,
      }

      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.put(cachedAvatar)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)

        setTimeout(() => {
          reject(new Error("IndexedDB write timeout"))
        }, 10000)
      })

      console.log("Avatar cached successfully for user:", userId)
    } catch (error) {
      console.error("Failed to cache avatar:", error)
    }
  }

  private async fetchWithRetry(url: string, retries: number): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(10000), // 10 секунд таймаут
        })
        return response
      } catch (error) {
        console.warn(`Fetch attempt ${i + 1} failed:`, error)
        if (i === retries - 1) {
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw new Error("All fetch attempts failed")
  }

  async getCachedAvatar(avatarId: string): Promise<string | null> {
    try {
      if (!this.db) {
        await this.init()
      }

      const cachedAvatar = await this.getCachedAvatarData(avatarId)

      if (!cachedAvatar) {
        return null
      }

      if (cachedAvatar.expiresAt < Date.now()) {
        this.deleteCachedAvatar(avatarId).catch(console.error)
        return null
      }

      const url = URL.createObjectURL(cachedAvatar.blob)
      return url
    } catch (error) {
      console.error("Failed to get cached avatar:", error)
      return null
    }
  }

  private async deleteCachedAvatar(avatarId: string): Promise<void> {
    try {
      if (!this.db) return

      const transaction = this.db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(avatarId)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to delete cached avatar:", error)
    }
  }

  async clearUserAvatars(userId: string): Promise<void> {
    try {
      if (!this.db) return

      const transaction = this.db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const index = store.index("userId")

      const request = index.openCursor(IDBKeyRange.only(userId))

      await new Promise<void>((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve()
          }
        }

        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error("Failed to clear user avatars:", error)
    }
  }

  async clearOldAvatars(maxAge: number = this.TTL): Promise<void> {
    try {
      if (!this.db) return

      const cutoffTime = Date.now()
      const transaction = this.db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const index = store.index("expiresAt")

      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime))

      await new Promise<void>((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            cursor.continue()
          } else {
            resolve()
          }
        }

        request.onerror = () => reject(request.error)
      })

      console.log("Old avatars cleared successfully")
    } catch (error) {
      console.error("Failed to clear old avatars:", error)
    }
  }
}

export const avatarCacheService = new AvatarCacheService()
