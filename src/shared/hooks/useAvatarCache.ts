"use client"

import { useState, useEffect } from "react"
import { avatarCacheService } from "../services/avatarCacheService"
import type { AvatarFile } from "@/entities/user/model/types"

interface UseAvatarCacheResult {
  getAvatarUrl: (avatarUrl?: string, avatarId?: AvatarFile | string, userId?: string, defaultAvatarPath?: string) => string
  cacheAvatar: (avatarUrl: string, userId: string, avatarId?: string) => Promise<void>
}

export const useAvatarCache = (): UseAvatarCacheResult => {
  const [cachedUrls, setCachedUrls] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    avatarCacheService.init().catch(console.error)

    avatarCacheService.clearOldAvatars().catch(console.error)
  }, [])

  const getAvatarUrl = (
    avatarUrl?: string,
    avatarId?: AvatarFile | string,
    userId?: string,
    defaultAvatarPath?: string,
  ): string => {
    const avatarIdString =
      typeof avatarId === "object" && avatarId?._id ? avatarId._id : typeof avatarId === "string" ? avatarId : null

    if (!avatarIdString) {
      return avatarUrl || defaultAvatarPath || "/placeholder.svg?height=120&width=120"
    }

    const cachedUrl = cachedUrls.get(avatarIdString)
    if (cachedUrl) {
      return cachedUrl
    }

    avatarCacheService
      .getCachedAvatar(avatarIdString)
      .then((url) => {
        if (url) {
          setCachedUrls((prev) => new Map(prev).set(avatarIdString, url))
        }
      })
      .catch(console.error)

    return avatarUrl || defaultAvatarPath || "/placeholder.svg?height=120&width=120"
  }

  const cacheAvatar = async (avatarUrl: string, userId: string, avatarId?: string): Promise<void> => {
    try {
      await avatarCacheService.cacheAvatar(avatarUrl, userId, avatarId)

      const finalAvatarId = avatarId || userId
      const cachedUrl = await avatarCacheService.getCachedAvatar(finalAvatarId)
      if (cachedUrl) {
        setCachedUrls((prev) => new Map(prev).set(finalAvatarId, cachedUrl))
      }
    } catch (error) {
      console.error("Failed to cache avatar:", error)
    }
  }

  return {
    getAvatarUrl,
    cacheAvatar,
  }
}
