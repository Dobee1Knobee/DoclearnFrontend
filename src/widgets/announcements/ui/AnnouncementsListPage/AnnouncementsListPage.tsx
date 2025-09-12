"use client"

import type React from "react"
import { Search, Plus } from "lucide-react"
import { AnnouncementFilters } from "../../../../features/announcements/ui/AnnouncementsListPage/AnnouncementFilters/AnnouncementFilters"
import { RecommendedAnnouncements } from "../../../../features/announcements/ui/AnnouncementsListPage/RecommendedAnnouncements/RecommendedAnnouncements"
import { AnnouncementsList } from "../../../../features/announcements/ui/AnnouncementsListPage/AnnouncementsList/AnnouncementsList"
import styles from "./AnnouncementsListPage.module.css"
import Link from "next/link"

export const AnnouncementsListPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input type="text" placeholder="Поиск мероприятий, курсов, вакансий..." className={styles.searchInput} />
          </div>
        </div>

        <RecommendedAnnouncements />

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <AnnouncementFilters />
          </aside>

          <main className={styles.main}>
            <AnnouncementsList />
          </main>
        </div>
      </div>

      <Link href="/announcements/create" className={styles.fab} aria-label="Создать объявление">
        <Plus size={24} />
      </Link>
    </div>
  )
}
