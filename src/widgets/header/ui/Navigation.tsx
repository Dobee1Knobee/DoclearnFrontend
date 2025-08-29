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

  // if (isMobile) {
  //   return (
  //     <div className={styles.iconsContainer}>
  //       <Link href="/News">
  //         <Newspaper className={`${styles.icon} ${pathname === "/News" ? styles.iconActive : ""}`} />
  //       </Link>
  //       <Link href="/Feed">
  //         <MessageSquare className={`${styles.icon} ${pathname === "/Feed" ? styles.iconActive : ""}`} />
  //       </Link>
  //       <Link href="/Aggregator">
  //         <FileText className={`${styles.icon} ${isAggregatorActive ? styles.iconActive : ""}`} />
  //       </Link>
  //       {isAuthenticated && (
  //         <Link href="/Learn">
  //           <BookOpen className={`${styles.icon} ${pathname === "/Learn" ? styles.iconActive : ""}`} />
  //         </Link>
  //       )}
  //     </div>
  //   )
  // }

  return (
      <div className={styles.iconsContainer}>
        <Link href="/News">
          <Newspaper className={`${styles.icon} ${pathname === "/News" ? styles.iconActive : ""}`} />
        </Link>
        <Link href="/Feed">
          <MessageSquare className={`${styles.icon} ${pathname === "/Feed" ? styles.iconActive : ""}`} />
        </Link>
        <Link href="/Aggregator">
          <FileText className={`${styles.icon} ${isAggregatorActive ? styles.iconActive : ""}`} />
        </Link>
        {isAuthenticated && (
          <Link href="/announcements">
            <BookOpen className={`${styles.icon} ${pathname === "/announcements" ? styles.iconActive : ""}`} />
          </Link>
        )}
      </div>
  )
}
