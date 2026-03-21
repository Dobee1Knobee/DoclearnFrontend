"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RefreshCw, UserPlus } from "lucide-react"
import http from "@/shared/api/http"
import { searchUsers } from "@/features/search/api/searchApi"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated, selectUser } from "@/features/auth/model/selectors"
import { updateUserFields } from "@/features/auth/model/slice"
import { useFollowUserMutation } from "@/features/profile-edit/api/profileEditApi"
import type { SearchUser } from "@/features/search/model/types"
import type { SpecialistUser } from "@/entities/user/model/types"
import styles from "./PlatformPeople.module.css"

interface PlatformPeopleProps {
  currentProfileId?: string
  embedded?: boolean
}

const SEARCH_SEEDS = ["ov", "an", "ar", "al", "da", "iv", "ma", "ra", "se", "ле", "ан", "ив"]
const CACHE_TTL = 5 * 60 * 1000
const STORAGE_KEY = "doclearn-platform-people-cache-v1"

interface DiscoverUsersCache {
  users: SearchUser[]
  fetchedAt: number
}

let discoverUsersCache: DiscoverUsersCache | null = null
let discoverUsersRequest: Promise<SearchUser[]> | null = null

const shuffleArray = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const toSearchUser = (user: SpecialistUser): SearchUser => ({
  _id: user._id,
  firstName: user.firstName,
  middleName: user.middleName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  specializations: "specializations" in user && Array.isArray(user.specializations) ? user.specializations : [],
  defaultAvatarPath: user.defaultAvatarPath,
  avatarUrl: user.avatarUrl || user.avatar || null,
  avatarId: typeof user.avatarId === "object" ? user.avatarId?._id : user.avatarId,
  location: user.location,
  experience: user.experience,
  rating: user.rating,
  placeWork: user.placeWork,
  isVerified: user.isVerified,
})

const getRoleLabel = (role: SearchUser["role"]): string => {
  switch (role) {
    case "student":
      return "Студент"
    case "resident":
      return "Ординатор"
    case "postgraduate":
      return "Аспирант"
    case "doctor":
      return "Врач"
    case "researcher":
      return "Исследователь"
    case "admin":
      return "Администратор"
    case "owner":
      return "Владелец"
    default:
      return "Пользователь"
  }
}

const readCachedUsers = (): DiscoverUsersCache | null => {
  if (discoverUsersCache) {
    return discoverUsersCache
  }

  if (typeof window === "undefined") {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as DiscoverUsersCache
    if (!Array.isArray(parsed.users) || typeof parsed.fetchedAt !== "number") {
      return null
    }

    discoverUsersCache = parsed
    return parsed
  } catch {
    return null
  }
}

const writeCachedUsers = (users: SearchUser[]) => {
  const cachePayload: DiscoverUsersCache = {
    users,
    fetchedAt: Date.now(),
  }

  discoverUsersCache = cachePayload

  if (typeof window === "undefined") {
    return
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cachePayload))
  } catch {
    // ignore storage errors
  }
}

const isFreshCache = (cache: DiscoverUsersCache | null): boolean => {
  return Boolean(cache && cache.users.length > 0 && Date.now() - cache.fetchedAt < CACHE_TTL)
}

async function fetchDiscoverUsers(): Promise<SearchUser[]> {
  if (discoverUsersRequest) {
    return discoverUsersRequest
  }

  discoverUsersRequest = (async () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null

    if (refreshToken) {
      try {
        const response = await http.get("/admin/users", {
          params: { page: 1 },
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        })

        const adminUsers = response.data?.data?.users
        if (Array.isArray(adminUsers) && adminUsers.length > 0) {
          const users = adminUsers.map((user: SpecialistUser) => toSearchUser(user))
          writeCachedUsers(users)
          return users
        }
      } catch {
        // fallback to public search pool
      }
    }

    const responses = await Promise.allSettled(SEARCH_SEEDS.map((seed) => searchUsers(seed)))
    const usersMap = new Map<string, SearchUser>()

    responses.forEach((result) => {
      if (result.status !== "fulfilled") {
        return
      }

      result.value.data.usersWithAvatars.forEach((user) => {
        usersMap.set(user._id, user)
      })
    })

    const users = Array.from(usersMap.values())
    writeCachedUsers(users)
    return users
  })()

  try {
    return await discoverUsersRequest
  } finally {
    discoverUsersRequest = null
  }
}

export const PlatformPeople: React.FC<PlatformPeopleProps> = ({ currentProfileId, embedded = false }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [followUser] = useFollowUserMutation()

  const [mounted, setMounted] = useState(false)
  const [pool, setPool] = useState<SearchUser[]>([])
  const [visibleUsers, setVisibleUsers] = useState<SearchUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [actionUserId, setActionUserId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const cached = readCachedUsers()
    if (cached && cached.users.length > 0) {
      setPool(cached.users)
      setIsLoading(false)
    }
  }, [])

  const [localFollowingIds, setLocalFollowingIds] = useState<string[]>(currentUser?.following || [])

  useEffect(() => {
    setLocalFollowingIds(currentUser?.following || [])
  }, [currentUser?.following])

  const buildVisibleUsers = (source: SearchUser[]) => {
    const filtered = source.filter((user) => user._id !== currentUser?._id && user._id !== currentProfileId)
    return shuffleArray(filtered).slice(0, 3)
  }

  useEffect(() => {
    if (pool.length > 0) {
      setVisibleUsers(buildVisibleUsers(pool))
      setIsLoading(false)
    }
  }, [pool, currentProfileId, currentUser?._id])

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      const cachedData = readCachedUsers()
      if (cachedData && isFreshCache(cachedData)) {
        setPool(cachedData.users)
        setVisibleUsers(buildVisibleUsers(cachedData.users))
        setIsLoading(false)
        return
      }

      const cachedUsers = cachedData?.users ?? []

      if (cachedUsers.length === 0) {
        setIsLoading(true)
      } else {
        setPool(cachedUsers)
        setVisibleUsers(buildVisibleUsers(cachedUsers))
        setIsLoading(false)
      }

      try {
        const users = await fetchDiscoverUsers()
        if (!active) return
        setPool(users)
        setVisibleUsers(buildVisibleUsers(users))
      } catch (error) {
        console.error("Failed to load platform people:", error)
        if (!active) return
        setPool([])
        setVisibleUsers([])
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [currentUser?._id, currentProfileId])

  const followingSet = useMemo(() => new Set(localFollowingIds), [localFollowingIds])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setVisibleUsers(buildVisibleUsers(pool))
    window.setTimeout(() => setIsRefreshing(false), 250)
  }

  const handleAction = async (user: SearchUser) => {
    const isFollowing = followingSet.has(user._id)

    if (isFollowing) {
      router.push(`/profile/${user._id}`)
      return
    }

    if (!isAuthenticated) {
      router.push(`/profile/${user._id}`)
      return
    }

    setActionUserId(user._id)
    try {
      await followUser(user._id).unwrap()
      setLocalFollowingIds((prev) => [...new Set([...prev, user._id])])

      if (currentUser?.stats) {
        dispatch(
          updateUserFields({
            stats: {
              ...currentUser.stats,
              followingCount: (currentUser.stats.followingCount || 0) + 1,
            },
          }),
        )
      }
    } catch (error) {
      console.error("Failed to follow platform user:", error)
    } finally {
      setActionUserId(null)
    }
  }

  if (!mounted) {
    return null
  }

  if (isLoading && visibleUsers.length === 0) {
    return (
      <div className={`${styles.block} ${embedded ? styles.embedded : ""}`}>
        <div className={styles.blockHeader}>
          <h3 className={styles.blockTitle}>{embedded ? "Рекомендуем" : "Люди на платформе"}</h3>
        </div>
        <div className={styles.stateText}>Подбираем...</div>
      </div>
    )
  }

  if (visibleUsers.length === 0) {
    return null
  }

  return (
    <div className={`${styles.block} ${embedded ? styles.embedded : ""}`}>
      <div className={styles.blockHeader}>
        <h3 className={styles.blockTitle}>{embedded ? "Рекомендуем" : "Люди на платформе"}</h3>
        {pool.length > 3 ? (
          <button type="button" className={styles.refreshButton} onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? styles.spinning : ""} />
            Еще
          </button>
        ) : null}
      </div>

      <div className={styles.list}>
        {visibleUsers.map((user) => {
          const fullName = `${user.lastName} ${user.firstName}`.trim()
          const specialization = user.specializations?.find((item) => item.main)?.name || getRoleLabel(user.role)
          const isFollowing = followingSet.has(user._id)
          const avatarSrc = user.avatarUrl || user.defaultAvatarPath || "/Avatars/Avatar1.webp"

          return (
            <div key={user._id} className={styles.personCard}>
              <button type="button" className={styles.personMain} onClick={() => router.push(`/profile/${user._id}`)}>
                <Image src={avatarSrc} alt={fullName} width={44} height={44} className={styles.avatar} />
                <div className={styles.personInfo}>
                  <span className={styles.personName}>{fullName}</span>
                  <span className={styles.personMeta}>{specialization}</span>
                </div>
              </button>

              <button
                type="button"
                className={isFollowing ? styles.profileButton : styles.followButton}
                onClick={() => handleAction(user)}
                disabled={actionUserId === user._id}
              >
                {actionUserId === user._id ? (
                  "..."
                ) : isFollowing ? (
                  "Профиль"
                ) : (
                  <>
                    <UserPlus size={14} />
                    Подписаться
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
