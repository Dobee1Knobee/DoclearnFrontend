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
  cleanup: () => void
}

export const useAvatarCache = (): UseAvatarCacheResult => {
  const [cachedUrls, setCachedUrls] = useState<Map<string, string>>(new Map())
  const createdUrls = useRef<Set<string>>(new Set())
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeCache = async () => {
      try {
        await avatarCacheService.init()
        if (mounted) {
          setIsInitialized(true)
        }

        avatarCacheService.clearOldAvatars().catch((error) => {
        })
      } catch (error) {
        if (mounted) {
          setIsInitialized(true)
        }
      }
    }

    initializeCache()

    return () => {
      mounted = false
      createdUrls.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url)
        } catch (error) {
        }
      })
      createdUrls.current.clear()
    }
  }, []) 

  const cleanup = useCallback(() => {
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
      const avatarIdString =
        typeof avatarId === "object" && avatarId?._id ? avatarId._id : typeof avatarId === "string" ? avatarId : null

      if (!avatarIdString) {
        return avatarUrl || defaultAvatarPath || "/placeholder.webp"
      }

      const cachedUrl = cachedUrls.get(avatarIdString)
      if (cachedUrl) {
        return cachedUrl
      }

      if (!isInitialized) {
        return avatarUrl || defaultAvatarPath || "/placeholder.webp"
      }

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
            avatarCacheService.cacheAvatar(avatarUrl, avatarIdString, userId).catch((error) => {
              console.error("Avatar cache: Failed to cache avatar:", error)
            })
          }
        })
        .catch((error) => {
          console.error("Avatar cache: Failed to get avatar from IndexedDB:", error)
        })

      return avatarUrl || defaultAvatarPath || "/placeholder.webp"
    },
    [cachedUrls, isInitialized],
  )

  const cacheAvatar = useCallback(async (avatarUrl: string, avatarId: string, userId?: string): Promise<void> => {
    try {
      await avatarCacheService.cacheAvatar(avatarUrl, avatarId, userId)

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
    }
  }, [])

  const invalidateAvatar = useCallback(
    async (avatarId: string): Promise<void> => {
      try {

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

        await avatarCacheService.invalidateAvatar(avatarId)
      } catch (error) {
        console.error("Avatar cache: Failed to invalidate avatar:", error)
      }
    },
    [cachedUrls],
  )

  return {
    getAvatarUrl,
    cacheAvatar,
    invalidateAvatar,
    cleanup,
  }
}
