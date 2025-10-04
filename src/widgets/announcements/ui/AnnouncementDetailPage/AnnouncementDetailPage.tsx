import type React from "react"
import type { Conference, Webinar, MasterClass, Vacancy, Olympiad } from "@/entities/announcement/model"
import { AnnouncementHeader } from "@/features/announcements/ui/AnnouncementsPage/AnnouncementHeader/AnnouncementHeader"
import { AnnouncementDetails } from "@/features/announcements/ui/AnnouncementsPage/AnnouncementDetails/AnnouncementDetails"
import { AnnouncementSidebar } from "@/features/announcements/ui/AnnouncementsPage/AnnouncementSidebar/AnnouncementSidebar"
import { SpeakersSection } from "@/features/announcements/ui/AnnouncementsPage/SpeakersSection/SpeakersSection"
import styles from "./AnnouncementDetailPage.module.css"

interface AnnouncementDetailPageProps {
  announcement: Conference | Webinar | MasterClass | Vacancy | Olympiad
}

export const AnnouncementDetailPage: React.FC<AnnouncementDetailPageProps> = ({ announcement }) => {
  const hasEventSpeakers =
    (announcement.type === "Conference" || announcement.type === "Webinar" || announcement.type === "Masterclass") &&
    (announcement as Conference | Webinar | MasterClass).speakers &&
    (announcement as Conference | Webinar | MasterClass).speakers!.length > 0

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <AnnouncementHeader announcement={announcement} />
        </div>

        <div className={styles.sidebar}>
          <AnnouncementSidebar announcement={announcement} />
        </div>

        <div className={styles.main}>
          <AnnouncementDetails announcement={announcement} />

          {hasEventSpeakers && (
            <SpeakersSection speakers={(announcement as Conference | Webinar | MasterClass).speakers!} />
          )}
        </div>
      </div>
    </div>
  )
}
