import type React from "react"
import type { Conference, Webinar, MasterClass } from "@/entities/announcement/model"
import { AnnouncementHeader } from "@/features/announcements/ui/AnnouncementsPage/AnnouncementHeader/AnnouncementHeader"
import { AnnouncementDetails } from "@/features/announcements/ui/AnnouncementsPage/AnnouncementDetails/AnnouncementDetails"
import { AnnouncementSidebar } from "@/features/announcements/ui/AnnouncementsPage/AnnouncementSidebar/AnnouncementSidebar"
import { SpeakersSection } from "@/features/announcements/ui/AnnouncementsPage/SpeakersSection/SpeakersSection"
import styles from "./AnnouncementDetailPage.module.css"

interface AnnouncementDetailPageProps {
  announcement: Conference | Webinar | MasterClass
}

export const AnnouncementDetailPage: React.FC<AnnouncementDetailPageProps> = ({ announcement }) => {
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

          {announcement.speakers && announcement.speakers.length > 0 && (
            <SpeakersSection speakers={announcement.speakers} />
          )}
        </div>
      </div>
    </div>
  )
}
