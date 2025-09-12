import type React from "react"
import { Calendar, MapPin, Eye } from "lucide-react"
import { categoryTypeTranslations } from "@/shared/lib/translations"
import { formatDate, getLocationText } from "@/shared/lib/formatters"
import type { Conference, Webinar, MasterClass } from "@/entities/announcement/model"
import styles from "./AnnouncementHeader.module.css"

interface AnnouncementHeaderProps {
  announcement: Conference | Webinar | MasterClass
}

export const AnnouncementHeader: React.FC<AnnouncementHeaderProps> = ({ announcement }) => {
  return (
    <div className={styles.header}>
      <div className={styles.badges}>
        <span className={styles.typeBadge}>
          {categoryTypeTranslations[announcement.type as keyof typeof categoryTypeTranslations] || announcement.type}
        </span>
        {announcement.isPromoted && <span className={styles.promotedBadge}>Рекомендуемое</span>}
      </div>

      <h1 className={styles.title}>{announcement.title}</h1>

      <div className={styles.organizer}>
        Организатор: <span className={styles.organizerName}>{announcement.organizer}</span>
      </div>

      {/* <div className={styles.meta}>
        <div className={styles.metaItem}>
          <Calendar size={18} className={styles.icon} />
          <span>{formatDate(announcement.activeFrom)}</span>
          {announcement.activeTo && <span> - {formatDate(announcement.activeTo)}</span>}
        </div>

        {announcement.location && (
          <div className={styles.metaItem}>
            <MapPin size={18} className={styles.icon} />
            <span>{getLocationText(announcement.location)}</span>
          </div>
        )}

        <div className={styles.metaItem}>
          <Eye size={18} className={styles.icon} />
          <span>{announcement.viewsCount} просмотров</span>
        </div>
      </div> */}
    </div>
  )
}
