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
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000
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

  /**
   * Удаляет все старые аватары для конкретного пользователя
   */
  private async clearUserAvatars(userId: string): Promise<void> {
    try {
      const db = await this.ensureDB()
      const transaction = db.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const index = store.index("userId")

      let deletedCount = 0
      await new Promise<void>((resolve, reject) => {
        const request = index.openCursor(IDBKeyRange.only(userId))
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            cursor.delete()
            deletedCount++
            cursor.continue()
          } else {
            if (deletedCount > 0) {
              console.log(`Avatar cache: Cleared ${deletedCount} old avatars for user ${userId}`)
            }
            resolve()
          }
        }
        request.onerror = () => {
          console.error("Avatar cache: Failed to clear user avatars", { userId, error: request.error })
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to clear user avatars", { userId, error })
      throw error
    }
  }

  async cacheAvatar(avatarUrl: string, avatarId: string, userId?: string): Promise<void> {
    try {
      const db = await this.ensureDB()

      const existing = await this.getCachedAvatar(avatarId)
      if (existing) {
        return
      }

      // Если указан userId, удаляем все старые аватары этого пользователя
      if (userId) {
        await this.clearUserAvatars(userId)
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
          console.log(`Avatar cache: Successfully cached avatar for user ${userId}`)
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

  /**
   * Удаляет все аватары конкретного пользователя (публичный метод)
   */
  async clearAvatarsForUser(userId: string): Promise<void> {
    await this.clearUserAvatars(userId)
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
            if (deletedCount > 0) {
              console.log(`Avatar cache: Cleared ${deletedCount} expired avatars`)
            }
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
          console.log("Avatar cache: Cleared all avatars")
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

  /**
   * Получает статистику кэша
   */
  async getCacheStats(): Promise<{ totalAvatars: number; totalSize: number; userCounts: Record<string, number> }> {
    try {
      const db = await this.ensureDB()
      const transaction = db.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)

      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => {
          const results = request.result
          let totalSize = 0
          const userCounts: Record<string, number> = {}

          results.forEach((item) => {
            totalSize += item.blob.size
            if (item.userId) {
              userCounts[item.userId] = (userCounts[item.userId] || 0) + 1
            }
          })

          resolve({
            totalAvatars: results.length,
            totalSize,
            userCounts,
          })
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
    } catch (error) {
      console.error("Avatar cache: Failed to get cache stats", error)
      return { totalAvatars: 0, totalSize: 0, userCounts: {} }
    }
  }
}

export const avatarCacheService = new AvatarCacheService()


// interface CachedAvatar {
//   blob: Blob
//   cachedAt: number
//   userId?: string
// }

// class AvatarCacheService {
//   private dbName = "AvatarCache"
//   private storeName = "avatars"
//   private version = 1
//   private db: IDBDatabase | null = null
//   private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 
//   private readonly MAX_RETRIES = 3
//   private readonly RETRY_DELAY = 1000

//   async init(): Promise<void> {
//     if (this.db) return

//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open(this.dbName, this.version)

//       request.onerror = () => {
//         console.error("Avatar cache: Failed to open IndexedDB", request.error)
//         reject(request.error)
//       }

//       request.onsuccess = () => {
//         this.db = request.result
//         resolve()
//       }

//       request.onupgradeneeded = (event) => {
//         const db = (event.target as IDBOpenDBRequest).result
//         if (!db.objectStoreNames.contains(this.storeName)) {
//           const store = db.createObjectStore(this.storeName, { keyPath: "id" })
//           store.createIndex("userId", "userId", { unique: false })
//           store.createIndex("cachedAt", "cachedAt", { unique: false })
//         }
//       }
//     })
//   }

//   private async ensureDB(): Promise<IDBDatabase> {
//     if (!this.db) {
//       await this.init()
//     }
//     if (!this.db) {
//       throw new Error("Failed to initialize database")
//     }
//     return this.db
//   }

//   private async fetchWithRetry(url: string, retries = this.MAX_RETRIES): Promise<Blob> {
//     for (let i = 0; i < retries; i++) {
//       try {
//         const response = await fetch(url)
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//         }
//         const blob = await response.blob()
//         return blob
//       } catch (error) {
//         console.error(`Avatar cache: Fetch attempt ${i + 1} failed`, { url, error })
//         if (i === retries - 1) throw error
//         await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY * (i + 1)))
//       }
//     }
//     throw new Error("All retry attempts failed")
//   }

//   async cacheAvatar(avatarUrl: string, avatarId: string, userId?: string): Promise<void> {
//     try {
//       const db = await this.ensureDB()

//       const existing = await this.getCachedAvatar(avatarId)
//       if (existing) {
//         return
//       }

//       const blob = await this.fetchWithRetry(avatarUrl)

//       const transaction = db.transaction([this.storeName], "readwrite")
//       const store = transaction.objectStore(this.storeName)

//       const cacheData: CachedAvatar & { id: string } = {
//         id: avatarId,
//         blob,
//         cachedAt: Date.now(),
//         userId,
//       }

//       await new Promise<void>((resolve, reject) => {
//         const request = store.put(cacheData)
//         request.onsuccess = () => {
//           resolve()
//         }
//         request.onerror = () => {
//           console.error("Avatar cache: Failed to cache avatar", { avatarId, error: request.error })
//           reject(request.error)
//         }
//       })
//     } catch (error) {
//       console.error("Avatar cache: Failed to cache avatar", { avatarUrl, avatarId, error })
//       throw error
//     }
//   }

//   async getCachedAvatar(avatarId: string): Promise<CachedAvatar | null> {
//     try {
//       const db = await this.ensureDB()
//       const transaction = db.transaction([this.storeName], "readonly")
//       const store = transaction.objectStore(this.storeName)

//       return new Promise((resolve, reject) => {
//         const request = store.get(avatarId)
//         request.onsuccess = () => {
//           const result = request.result
//           if (result) {
//             const isExpired = Date.now() - result.cachedAt > this.CACHE_DURATION
//             if (isExpired) {
//               this.invalidateAvatar(avatarId).catch(console.error)
//               resolve(null)
//             } else {
//               resolve({
//                 blob: result.blob,
//                 cachedAt: result.cachedAt,
//                 userId: result.userId,
//               })
//             }
//           } else {
//             resolve(null)
//           }
//         }
//         request.onerror = () => {
//           console.error("Avatar cache: Failed to get cached avatar", { avatarId, error: request.error })
//           reject(request.error)
//         }
//       })
//     } catch (error) {
//       console.error("Avatar cache: Failed to get cached avatar", { avatarId, error })
//       return null
//     }
//   }

//   async invalidateAvatar(avatarId: string): Promise<void> {
//     try {
//       const db = await this.ensureDB()
//       const transaction = db.transaction([this.storeName], "readwrite")
//       const store = transaction.objectStore(this.storeName)

//       await new Promise<void>((resolve, reject) => {
//         const request = store.delete(avatarId)
//         request.onsuccess = () => {
//           resolve()
//         }
//         request.onerror = () => {
//           console.error("Avatar cache: Failed to invalidate avatar", { avatarId, error: request.error })
//           reject(request.error)
//         }
//       })
//     } catch (error) {
//       console.error("Avatar cache: Failed to invalidate avatar", { avatarId, error })
//       throw error
//     }
//   }

//   async clearOldAvatars(): Promise<void> {
//     try {
//       const db = await this.ensureDB()
//       const transaction = db.transaction([this.storeName], "readwrite")
//       const store = transaction.objectStore(this.storeName)
//       const index = store.index("cachedAt")

//       const cutoffTime = Date.now() - this.CACHE_DURATION
//       const range = IDBKeyRange.upperBound(cutoffTime)

//       let deletedCount = 0
//       await new Promise<void>((resolve, reject) => {
//         const request = index.openCursor(range)
//         request.onsuccess = (event) => {
//           const cursor = (event.target as IDBRequest).result
//           if (cursor) {
//             cursor.delete()
//             deletedCount++
//             cursor.continue()
//           } else {
//             resolve()
//           }
//         }
//         request.onerror = () => {
//           console.error("Avatar cache: Failed to clear old avatars", request.error)
//           reject(request.error)
//         }
//       })
//     } catch (error) {
//       console.error("Avatar cache: Failed to clear old avatars", error)
//     }
//   }

//   async clearAll(): Promise<void> {
//     try {
//       const db = await this.ensureDB()
//       const transaction = db.transaction([this.storeName], "readwrite")
//       const store = transaction.objectStore(this.storeName)

//       await new Promise<void>((resolve, reject) => {
//         const request = store.clear()
//         request.onsuccess = () => {
//           resolve()
//         }
//         request.onerror = () => {
//           console.error("Avatar cache: Failed to clear all avatars", request.error)
//           reject(request.error)
//         }
//       })
//     } catch (error) {
//       console.error("Avatar cache: Failed to clear all avatars", error)
//       throw error
//     }
//   }
// }

// export const avatarCacheService = new AvatarCacheService()
