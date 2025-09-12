import type React from "react"
import Link from "next/link"
import { AnnouncementCard } from "../../../../../entities/announcement/ui/AnnouncementCard/AnnouncementCard"
import { getAllMockAnnouncements } from "../../../../../entities/announcement/model/mockData"
import styles from "./RecommendedAnnouncements.module.css"

export const RecommendedAnnouncements: React.FC = () => {
  const recommendedAnnouncements = getAllMockAnnouncements()
    .filter((announcement) => announcement.isPromoted)
    .slice(0, 3)

  return (
    <div className={styles.recommended}>
      <h2 className={styles.title}>Рекомендуемые</h2>
      <div className={styles.grid}>
        {recommendedAnnouncements.map((announcement) => (
          <Link key={announcement.id} href={`/announcements/${announcement.id}`} className={styles.cardLink}>
            <AnnouncementCard announcement={announcement} variant="compact" className={styles.card} />
          </Link>
        ))}
      </div>
    </div>
  )
}
