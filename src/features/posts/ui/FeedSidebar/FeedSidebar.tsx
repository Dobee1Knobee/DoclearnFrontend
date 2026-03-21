"use client"

import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Newspaper,
  Search,
  UserRound,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated, selectUser } from "@/features/auth/model/selectors"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import { useSearch } from "@/features/search/hooks/useSearch"
import { SearchDropdown } from "@/features/search/ui/SearchDropdown"
import { SearchInput } from "@/features/search/ui/SearchInput"
import { PlatformPeople } from "@/features/profile-common/ui/ProfileSidebar/PlatformPeople/PlatformPeople"
import styles from "./FeedSidebar.module.css"

const FeedSidebarInner: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const { getAvatarUrl } = useAvatarCache()
  const [mobileOpen, setMobileOpen] = useState(false)

  const {
    query, results, totalCount,
    isLoading: searchLoading, error: searchError,
    selectedIndex, isOpen: searchOpen,
    setQuery, selectResult, closeSearch, clearSearch, handleKeyDown,
  } = useSearch()

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const avatarSrc = currentUser
    ? getAvatarUrl(currentUser.avatarUrl || currentUser.avatar, currentUser.avatarId, currentUser._id, currentUser.defaultAvatarPath) || "/placeholder.webp"
    : "/placeholder.webp"

  const navItems = [
    { href: "/Feed", label: "Лента", icon: <Home size={18} />, active: pathname === "/Feed" },
    { href: "/News", label: "Новости", icon: <Newspaper size={18} />, active: pathname === "/News" },
    { href: "/Aggregator", label: "Статьи", icon: <FileText size={18} />, active: pathname.startsWith("/Aggregator") },
    ...(isAuthenticated ? [{ href: "/announcements", label: "Анонсы", icon: <BookOpen size={18} />, active: pathname === "/announcements" }] : []),
  ]

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setMobileOpen((p) => !p)} aria-label="Меню">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
        {currentUser ? (
          <button type="button" className={styles.userCard} onClick={() => router.push(`/profile/${currentUser._id}`)}>
            <Image src={avatarSrc} alt="" width={36} height={36} className={styles.userAvatar} unoptimized />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser.firstName} {currentUser.lastName}</span>
              <span className={styles.userMeta}>Мой профиль</span>
            </div>
          </button>
        ) : (
          <Link href="/" className={styles.userCard}>
            <MessageSquare size={20} />
            <span className={styles.userName}>DocLearn</span>
          </Link>
        )}

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.active ? styles.active : ""}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          {isAuthenticated && currentUser && (
            <Link href={`/profile/${currentUser._id}`} className={styles.navItem}>
              <span className={styles.navIcon}><UserRound size={18} /></span>
              <span>Личный кабинет</span>
            </Link>
          )}
        </nav>

        <div className={styles.searchBlock}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={15} />
            <SearchInput value={query} onChange={setQuery} onKeyDown={handleKeyDown} placeholder="Найти людей" className={styles.searchInput} />
            <SearchDropdown
              isOpen={searchOpen} results={results} totalCount={totalCount}
              isLoading={searchLoading} error={searchError} selectedIndex={selectedIndex}
              onSelectResult={(user) => { selectResult(user); clearSearch() }}
              onClose={closeSearch}
            />
          </div>
          <PlatformPeople embedded />
        </div>
      </aside>
    </>
  )
}

export const FeedSidebar: React.FC = () => (
  <Suspense fallback={<div style={{ width: 280 }} />}>
    <FeedSidebarInner />
  </Suspense>
)
