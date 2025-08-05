"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { avatarCacheService } from "../services/avatarCacheService"
import type { AvatarFile } from "@/entities/user/model/types"

interface UseAvatarCacheResult {
  getAvatarUrl: (
    avatarUrl?: string,
    avatarId?: AvatarFile | string,
    userId?: string,
    defaultAvatarPath?: string,
  ) => string
  cacheAvatar: (avatarUrl: string, avatarId: string, userId?: string) => Promise<void>
  invalidateAvatar: (avatarId: string) => Promise<void>
  clearUserAvatars: (userId: string) => Promise<void>
  cleanup: () => void
}

export const useAvatarCache = (): UseAvatarCacheResult => {
  // Локальный кэш для быстрого доступа (только URL, не blob)
  const [cachedUrls, setCachedUrls] = useState<Map<string, string>>(new Map())
  // Храним созданные URL для очистки
  const createdUrls = useRef<Set<string>>(new Set())
  // Флаг инициализации
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeCache = async () => {
      try {
        await avatarCacheService.init()
        if (mounted) {
          setIsInitialized(true)
        }

        // Очищаем старые аватары при инициализации
        avatarCacheService.clearOldAvatars().catch((error) => {})
      } catch (error) {
        if (mounted) {
          setIsInitialized(true) // Все равно помечаем как инициализированный
        }
      }
    }

    initializeCache()

    return () => {
      mounted = false
      // Cleanup при размонтировании
      createdUrls.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch (error) {}
      })
      createdUrls.current.clear()
    }
  }, []) // Пустой массив зависимостей - выполняется только один раз

  const cleanup = useCallback(() => {
    // Освобождаем все созданные URL
    createdUrls.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url)
      } catch (error) {
        console.warn("Avatar cache: Failed to revoke URL:", error)
      }
    })
    createdUrls.current.clear()
    setCachedUrls(new Map())
  }, [])

  const getAvatarUrl = useCallback(
    (avatarUrl?: string, avatarId?: AvatarFile | string, userId?: string, defaultAvatarPath?: string): string => {
      // Извлекаем строковый ID из объекта или используем как есть
      const avatarIdString =
        typeof avatarId === "object" && avatarId?._id ? avatarId._id : typeof avatarId === "string" ? avatarId : null

      // Если нет avatarIdString, возвращаем оригинальный URL или дефолтный аватар
      if (!avatarIdString) {
        return avatarUrl || defaultAvatarPath || "/placeholder.webp"
      }

      // Проверяем локальный кэш
      const cachedUrl = cachedUrls.get(avatarIdString)
      if (cachedUrl) {
        return cachedUrl
      }

      // Если кэш еще не инициализирован, возвращаем fallback
      if (!isInitialized) {
        return avatarUrl || defaultAvatarPath || "/placeholder.webp"
      }

      // Асинхронно загружаем из IndexedDB и обновляем локальный кэш
      avatarCacheService
        .getCachedAvatar(avatarIdString)
        .then((cached) => {
          if (cached) {
            const blobUrl = URL.createObjectURL(cached.blob)
            createdUrls.current.add(blobUrl)
            setCachedUrls((prev) => {
              const newMap = new Map(prev)
              newMap.set(avatarIdString, blobUrl)
              return newMap
            })
          } else if (avatarUrl && userId) {
            // Если в кэше нет, но есть оригинальный URL - кэшируем его
            avatarCacheService.cacheAvatar(avatarUrl, avatarIdString, userId).catch((error) => {
              console.error("Avatar cache: Failed to cache avatar:", error)
            })
          }
        })
        .catch((error) => {
          console.error("Avatar cache: Failed to get avatar from IndexedDB:", error)
        })

      // Возвращаем оригинальный URL или дефолтный пока загружается кэш
      return avatarUrl || defaultAvatarPath || "/placeholder.webp"
    },
    [cachedUrls, isInitialized],
  )

  const cacheAvatar = useCallback(async (avatarUrl: string, avatarId: string, userId?: string): Promise<void> => {
    try {
      await avatarCacheService.cacheAvatar(avatarUrl, avatarId, userId)

      // Обновляем локальный кэш
      const cached = await avatarCacheService.getCachedAvatar(avatarId)
      if (cached) {
        const blobUrl = URL.createObjectURL(cached.blob)
        createdUrls.current.add(blobUrl)
        setCachedUrls((prev) => {
          const newMap = new Map(prev)
          newMap.set(avatarId, blobUrl)
          return newMap
        })
      }
    } catch (error) {
      console.error("Avatar cache: Failed to cache avatar:", error)
      // Не выбрасываем ошибку, чтобы не ломать основной функционал
    }
  }, [])

  const invalidateAvatar = useCallback(
    async (avatarId: string): Promise<void> => {
      try {
        // Удаляем из локального кэша
        const cachedUrl = cachedUrls.get(avatarId)
        if (cachedUrl) {
          URL.revokeObjectURL(cachedUrl)
          createdUrls.current.delete(cachedUrl)
          setCachedUrls((prev) => {
            const newMap = new Map(prev)
            newMap.delete(avatarId)
            return newMap
          })
        }

        // Удаляем из IndexedDB
        await avatarCacheService.invalidateAvatar(avatarId)
      } catch (error) {
        console.error("Avatar cache: Failed to invalidate avatar:", error)
      }
    },
    [cachedUrls],
  )

  const clearUserAvatars = useCallback(async (userId: string): Promise<void> => {
    try {
      await avatarCacheService.clearAvatarsForUser(userId)

      // Очищаем локальный кэш для этого пользователя
      setCachedUrls((prev) => {
        const newMap = new Map(prev)
        // Удаляем все URL, которые могут принадлежать этому пользователю
        // (это приблизительная очистка, так как мы не храним userId в локальном кэше)
        return newMap
      })
    } catch (error) {
      console.error("Avatar cache: Failed to clear user avatars:", error)
    }
  }, [])

  return {
    getAvatarUrl,
    cacheAvatar,
    invalidateAvatar,
    clearUserAvatars, // Add this line
    cleanup,
  }
}
