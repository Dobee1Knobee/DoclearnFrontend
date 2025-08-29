import type React from "react"
import { Search } from "lucide-react"
import { AnnouncementFilters } from "../../../../features/announcements/ui/AnnouncementFilters/AnnouncementFilters"
import { RecommendedAnnouncements } from "../../../../features/announcements/ui/RecommendedAnnouncements/RecommendedAnnouncements"
import { AnnouncementsList } from "../../../../features/announcements/ui/AnnouncementsList/AnnouncementsList"
import styles from "./AnnouncementsPage.module.css"

export const AnnouncementsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск мероприятий, курсов, вакансий..."
              className={styles.searchInput}
            />
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
    </div>
  )
}
