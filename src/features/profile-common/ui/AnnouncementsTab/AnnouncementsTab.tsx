"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { AnnouncementCard } from "./AnnouncementCard"
import { MegaphoneOff } from "lucide-react"
import { mockUserAnnouncements } from "./mockData"
import styles from "./AnnouncementsTab.module.css"

type AnnouncementsTabProps = {}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = () => {
  const router = useRouter()

  const announcements = mockUserAnnouncements

  const handleManage = (id: string) => {
    router.push(`/announcements/${id}/manage`)
  }

  const handleCreateAnnouncement = () => {
    router.push("/announcements/create")
  }

  if (announcements.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><MegaphoneOff size={48}/></div>
        <h3 className={styles.emptyTitle}>У вас пока нет объявлений</h3>
        <p className={styles.emptyDescription}>Создайте своё первое объявление и начните привлекать участников</p>
        <button className={styles.createButton} onClick={handleCreateAnnouncement}>
          Создать объявление
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Мои объявления</h2>
        <button className={styles.createButton} onClick={handleCreateAnnouncement}>
          Создать объявление
        </button>
      </div>
      <div className={styles.grid}>
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} onManage={handleManage} />
        ))}
      </div>
    </div>
  )
}
