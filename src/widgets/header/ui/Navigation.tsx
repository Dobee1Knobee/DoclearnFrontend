"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Header.module.css"
import { Newspaper, MessageSquare, FileText, BookOpen } from "lucide-react"

interface NavigationProps {
  isAuthenticated?: boolean
  // isMobile?: boolean
}

export default function Navigation({ isAuthenticated = false }: NavigationProps) {
  const pathname = usePathname()

  const isAggregatorActive = pathname.startsWith("/Aggregator")

  const items = [
    {
      href: "/News",
      label: "Новости",
      icon: Newspaper,
      active: pathname === "/News",
    },
    {
      href: "/Feed",
      label: "Лента",
      icon: MessageSquare,
      active: pathname === "/Feed",
    },
    {
      href: "/Aggregator",
      label: "Статьи",
      icon: FileText,
      active: isAggregatorActive,
    },
    ...(isAuthenticated
      ? [
          {
            href: "/announcements",
            label: "Анонсы",
            icon: BookOpen,
            active: pathname === "/announcements",
          },
        ]
      : []),
  ]

  return (
    <nav className={styles.iconsContainer} aria-label="Основная навигация">
      {items.map(({ href, label, icon: Icon, active }) => (
        <Link key={href} href={href} className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}>
          <Icon className={`${styles.icon} ${active ? styles.iconActive : ""}`} />
          <span className={styles.navLabel}>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
