import type React from "react"
import { AnnouncementCard } from "../../../../entities/announcement/ui/AnnouncementCard/AnnouncementCard"
import { mockRecommendedAnnouncements } from "../../model/mockData"
import styles from "./RecommendedAnnouncements.module.css"

export const RecommendedAnnouncements: React.FC = () => {
  return (
    <div className={styles.recommended}>
      <h2 className={styles.title}>Рекомендуемые</h2>
      <div className={styles.grid}>
        {mockRecommendedAnnouncements.slice(0, 3).map((announcement, index) => (
          <AnnouncementCard key={index} announcement={announcement} variant="compact" className={styles.card} />
        ))}
      </div>
    </div>
  )
}
