"use client"

import type React from "react"
import { useState } from "react"
import { Search, Plus, Filter, X } from "lucide-react"
import { AnnouncementFilters } from "../../../../features/announcements/ui/AnnouncementsListPage/AnnouncementFilters/AnnouncementFilters"
import { RecommendedAnnouncements } from "../../../../features/announcements/ui/AnnouncementsListPage/RecommendedAnnouncements/RecommendedAnnouncements"
import { AnnouncementsList } from "../../../../features/announcements/ui/AnnouncementsListPage/AnnouncementsList/AnnouncementsList"
import styles from "./AnnouncementsListPage.module.css"
import Link from "next/link"

export const AnnouncementsListPage: React.FC = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen)
  }

  const closeFilters = () => {
    setIsFiltersOpen(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input type="text" placeholder="Поиск мероприятий, курсов, вакансий..." className={styles.searchInput} />
          </div>
          <button className={styles.mobileFilterButton} onClick={toggleFilters} aria-label="Открыть фильтры">
            <Filter size={20} />
          </button>
        </div>

        <RecommendedAnnouncements />

        <div className={styles.content}>
          <aside className={`${styles.sidebar} ${isFiltersOpen ? styles.sidebarOpen : ""}`}>
            <button className={styles.mobileCloseButton} onClick={closeFilters} aria-label="Закрыть фильтры">
              <X size={20} />
            </button>
            <AnnouncementFilters />
          </aside>

          <main className={styles.main}>
            <AnnouncementsList />
          </main>
        </div>

        {isFiltersOpen && <div className={styles.overlay} onClick={closeFilters} aria-hidden="true" />}
      </div>

      <Link href="/announcements/create" className={styles.fab} aria-label="Создать объявление">
        <Plus size={24} />
      </Link>
    </div>
  )
}
