interface CachedAvatar {
  blob: Blob
  cachedAt: number
  userId?: string
}

class AvatarCacheService {
  private dbName = "AvatarCache"
  private storeName = "avatars"
  private version = 1
  private db: IDBDatabase | null = null
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 дней
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000

  async init(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        console.error("Avatar cache: Failed to open IndexedDB", request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" })
          store.createIndex("userId", "userId", { unique: false })
          store.createIndex("cachedAt", "cachedAt", { unique: false })
        }
      }
    })
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error("Failed to initialize database")
    }
    return this.db
  }

  private async fetchWithRetry(url: string, retries = this.MAX_RETRIES): Promise<Blob> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        const blob = await response.blob()
        return blob
      } catch (error) {
        console.error(`Avatar cache: Fetch attempt ${i + 1} failed`, { url, error })
        if (i === retries - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY * (i + 1)))
      }
    }
    throw new Error("All retry attempts failed")
  }

  async cacheAvatar(avatarUrl: string, avatarId: string, userId?: string): Promise<void> {
    try {
      const db = await this.ensureDB()

      // Проверяем, есть ли уже в кэше
      const existing = await this.getCachedAvatar(avatarId)
      if (existing) {
        return
      }

      const blob = await this.fetchWithRetry(avatarUrl)

      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      const cacheData: CachedAvatar & { id: string } = {
        id: avatarId,
        blob,
        cachedAt: Date.now(),
        userId,
      }

      await new Promise<void>((resolve, reject) => {
        const request = store.put(cacheData)
        request.onsuccess = () => {
          resolve()
        }
        request.onerror = () => {
          console.error("Avatar cache: Failed to cache avatar", { avatarId, error: request.error })
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to cache avatar", { avatarUrl, avatarId, error })
      throw error
    }
  }

  async getCachedAvatar(avatarId: string): Promise<CachedAvatar | null> {
    try {
      const db = await this.ensureDB()
      const transaction = db.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)

      return new Promise((resolve, reject) => {
        const request = store.get(avatarId)
        request.onsuccess = () => {
          const result = request.result
          if (result) {
            // Проверяем срок действия
            const isExpired = Date.now() - result.cachedAt > this.CACHE_DURATION
            if (isExpired) {
              this.invalidateAvatar(avatarId).catch(console.error)
              resolve(null)
            } else {
              resolve({
                blob: result.blob,
                cachedAt: result.cachedAt,
                userId: result.userId,
              })
            }
          } else {
            resolve(null)
          }
        }
        request.onerror = () => {
          console.error("Avatar cache: Failed to get cached avatar", { avatarId, error: request.error })
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to get cached avatar", { avatarId, error })
      return null
    }
  }

  async invalidateAvatar(avatarId: string): Promise<void> {
    try {
      const db = await this.ensureDB()
      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(avatarId)
        request.onsuccess = () => {
          resolve()
        }
        request.onerror = () => {
          console.error("Avatar cache: Failed to invalidate avatar", { avatarId, error: request.error })
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to invalidate avatar", { avatarId, error })
      throw error
    }
  }

  async clearOldAvatars(): Promise<void> {
    try {
      const db = await this.ensureDB()
      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const index = store.index("cachedAt")

      const cutoffTime = Date.now() - this.CACHE_DURATION
      const range = IDBKeyRange.upperBound(cutoffTime)

      let deletedCount = 0
      await new Promise<void>((resolve, reject) => {
        const request = index.openCursor(range)
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            deletedCount++
            cursor.continue()
          } else {
            resolve()
          }
        }
        request.onerror = () => {
          console.error("Avatar cache: Failed to clear old avatars", request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to clear old avatars", error)
    }
  }

  async clearAll(): Promise<void> {
    try {
      const db = await this.ensureDB()
      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)

      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => {
          resolve()
        }
        request.onerror = () => {
          console.error("Avatar cache: Failed to clear all avatars", request.error)
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to clear all avatars", error)
      throw error
    }
  }
}

export const avatarCacheService = new AvatarCacheService()
