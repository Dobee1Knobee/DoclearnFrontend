import type React from "react"
import { AnnouncementCard } from "../../../../entities/announcement/ui/AnnouncementCard/AnnouncementCard"
import { mockAllAnnouncements } from "../../model/mockData"
import styles from "./AnnouncementsList.module.css"

export const AnnouncementsList: React.FC = () => {
  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h2 className={styles.title}>Все мероприятия</h2>
        <span className={styles.count}>{mockAllAnnouncements.length} найдено</span>
      </div>

      <div className={styles.grid}>
        {mockAllAnnouncements.map((announcement, index) => (
          <AnnouncementCard key={index} announcement={announcement} variant="default" />
        ))}
      </div>
    </div>
  )
}
