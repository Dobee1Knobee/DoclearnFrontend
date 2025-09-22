"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./BottomNavigation.module.css"
import { Newspaper, MessageSquare, FileText, BookOpen } from "lucide-react"

interface BottomNavigationProps {
    isAuthenticated?: boolean
}

export default function BottomNavigation({ isAuthenticated = false }: BottomNavigationProps) {
    const pathname = usePathname()

    const isAggregatorActive = pathname.startsWith("/Aggregator")

    return (
        <div className={styles.bottomNavigation}>
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
        </div>
    )
}

