import type React from "react"
import Link from "next/link"
import { AnnouncementCard } from "../../../../../entities/announcement/ui/AnnouncementCard/AnnouncementCard"
import { getAllMockAnnouncements } from "../../../../../entities/announcement/model/mockData"
import styles from "./AnnouncementsList.module.css"

export const AnnouncementsList: React.FC = () => {
  const announcements = getAllMockAnnouncements()

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h2 className={styles.title}>Все мероприятия</h2>
        <span className={styles.count}>{announcements.length} найдено</span>
      </div>

      <div className={styles.grid}>
        {announcements.map((announcement) => (
          <Link key={announcement.id} href={`/announcements/${announcement.id}`} className={styles.cardLink}>
            <AnnouncementCard announcement={announcement} variant="default" />
          </Link>
        ))}
      </div>
    </div>
  )
}
