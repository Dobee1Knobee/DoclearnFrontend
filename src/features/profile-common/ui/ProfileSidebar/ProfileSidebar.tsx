"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  BookOpen,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Search,
  Menu,
  Settings,
  Stethoscope,
  User,
  X,
} from "lucide-react"
import logo from "@/../../public/logo.webp"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated, selectIsInitialized, selectUser } from "@/features/auth/model/selectors"
import { useGetAuthorProfileQuery } from "@/features/author-profile/api/authorProfileApi"
import type { SpecialistUser } from "@/entities/user/model/types"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import { useSearch } from "@/features/search/hooks/useSearch"
import { SearchDropdown } from "@/features/search/ui/SearchDropdown"
import { SearchInput } from "@/features/search/ui/SearchInput"
import { PlatformPeople } from "./PlatformPeople/PlatformPeople"
import styles from "./ProfileSidebar.module.css"

interface ProfileSidebarProps {
  userId: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  count?: number
  roles?: string[]
}

const getRoleLabel = (role: SpecialistUser["role"]): string => {
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

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ userId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isInitialized = useAppSelector(selectIsInitialized)
  const { getAvatarUrl } = useAvatarCache()

  const [mobileOpen, setMobileOpen] = useState(false)
  const currentUserFallbackAvatar = currentUser?.defaultAvatarPath || "/placeholder.webp"
  const currentUserAvatar = currentUser
    ? getAvatarUrl(currentUser.avatarUrl || currentUser.avatar, currentUser.avatarId, currentUser._id, currentUserFallbackAvatar)
    : currentUserFallbackAvatar
  const [currentUserAvatarSrc, setCurrentUserAvatarSrc] = useState(currentUserAvatar)

  const {
    query,
    results,
    totalCount,
    isLoading: searchLoading,
    error: searchError,
    selectedIndex,
    isOpen: searchOpen,
    setQuery,
    selectResult,
    closeSearch,
    clearSearch,
    handleKeyDown,
  } = useSearch()

  const isOwnProfile = isInitialized && isAuthenticated && currentUser?._id === userId

  const { data: otherProfile } = useGetAuthorProfileQuery(userId, {
    skip: !isInitialized || isOwnProfile,
  })

  const profile: SpecialistUser | undefined = isOwnProfile ? (currentUser as SpecialistUser) : (otherProfile as SpecialistUser)
  const isForeignProfileView = Boolean(profile && currentUser && currentUser._id !== userId)
  const ownProfilePath = currentUser?._id ? `/profile/${currentUser._id}` : null
  const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : "DocLearn"
  const currentUserMeta = currentUser ? getRoleLabel(currentUser.role) : "Профиль"

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname, searchParams])

  useEffect(() => {
    setCurrentUserAvatarSrc(currentUserAvatar)
  }, [currentUserAvatar])

  const handleCurrentUserAvatarError = () => {
    if (currentUserAvatarSrc !== currentUserFallbackAvatar) {
      setCurrentUserAvatarSrc(currentUserFallbackAvatar)
      return
    }

    if (currentUserFallbackAvatar !== "/placeholder.webp") {
      setCurrentUserAvatarSrc("/placeholder.webp")
    }
  }

  const activeProfileSection = pathname.endsWith("/edit") ? "settings" : searchParams.get("tab") || "overview"

  const profileNavItems: NavItem[] = profile
    ? [
        {
          id: "overview",
          label: isForeignProfileView ? "Профиль" : "Обзор",
          icon: <LayoutDashboard size={18} />,
          path: `/profile/${userId}`,
        },
        {
          id: "publications",
          label: "Публикации",
          icon: <FileText size={18} />,
          path: `/profile/${userId}?tab=publications`,
          count: profile.publications?.length || 0,
        },
        {
          id: "cases",
          label: "Кейсы",
          icon: <Stethoscope size={18} />,
          path: `/profile/${userId}?tab=cases`,
          roles: ["doctor", "admin", "owner", "researcher"],
        },
        {
          id: "education",
          label: "Образование",
          icon: <GraduationCap size={18} />,
          path: `/profile/${userId}?tab=education`,
        },
        {
          id: "documents",
          label: "Документы",
          icon: <FolderOpen size={18} />,
          path: `/profile/${userId}?tab=documents`,
          count: profile.documents?.length || 0,
        },
        ...(isOwnProfile
          ? [{ id: "settings", label: "Редактирование", icon: <Settings size={18} />, path: `/profile/${userId}/edit` }]
          : []),
      ].filter((item) => !item.roles || item.roles.includes(profile.role))
    : []

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setMobileOpen((prev) => !prev)} aria-label="Открыть меню профиля">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
        <nav className={styles.systemBar}>
          <Link href="/Feed" className={styles.systemIcon} title="Лента">
            <Home size={18} />
          </Link>
          <Link href="/News" className={styles.systemIcon} title="Новости">
            <Newspaper size={18} />
          </Link>
          <Link href="/Feed" className={styles.systemIcon} title="Лента">
            <MessageSquare size={18} />
          </Link>
          <Link href="/Aggregator" className={styles.systemIcon} title="Статьи">
            <FileText size={18} />
          </Link>
          {isAuthenticated && (
            <Link href="/announcements" className={styles.systemIcon} title="Анонсы">
              <BookOpen size={18} />
            </Link>
          )}
        </nav>

        <button
          type="button"
          className={styles.brandArea}
          onClick={() => {
            if (isForeignProfileView && ownProfilePath) {
              router.push(ownProfilePath)
            }
          }}
          disabled={!isForeignProfileView}
        >
          <Image
            src={currentUserAvatarSrc || "/placeholder.webp"}
            alt={currentUserName}
            width={40}
            height={40}
            className={styles.brandAvatar}
            unoptimized={currentUserAvatarSrc.startsWith("blob:")}
            onError={handleCurrentUserAvatarError}
          />
          <div className={styles.brandTextWrap}>
            <span className={styles.brandTitle}>{currentUserName}</span>
            <span className={styles.brandMeta}>{isForeignProfileView ? `Вернуться в ЛК` : currentUserMeta}</span>
          </div>
        </button>

        <div className={styles.sectionBlock}>
          <nav className={styles.linkList}>
            {profileNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.linkItem} ${activeProfileSection === item.id ? styles.activeLink : ""}`}
                onClick={() => {
                  if (activeProfileSection !== item.id) {
                    router.push(item.path)
                  }
                }}
                disabled={activeProfileSection === item.id}
              >
                <span className={styles.linkIcon}>{item.icon}</span>
                <span className={styles.linkLabel}>{item.label}</span>
                {item.count !== undefined && item.count > 0 ? <span className={styles.linkBadge}>{item.count}</span> : null}
              </button>
            ))}
          </nav>
        </div>

        <div className={`${styles.sectionBlock} ${styles.peopleBlock}`}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={16} />
            <SearchInput
              value={query}
              onChange={setQuery}
              onKeyDown={handleKeyDown}
              placeholder="Найти людей"
              className={styles.searchInput}
            />
            <SearchDropdown
              isOpen={searchOpen}
              results={results}
              totalCount={totalCount}
              isLoading={searchLoading}
              error={searchError}
              selectedIndex={selectedIndex}
              onSelectResult={(user) => {
                selectResult(user)
                clearSearch()
              }}
              onClose={closeSearch}
            />
          </div>

          <PlatformPeople currentProfileId={userId} embedded />
        </div>

      </aside>
    </>
  )
}
