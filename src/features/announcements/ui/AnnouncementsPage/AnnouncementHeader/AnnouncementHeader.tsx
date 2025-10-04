import type React from "react"
import { categoryTypeTranslations } from "@/shared/lib/translations"
import type { Conference, Webinar, MasterClass, Vacancy, Olympiad } from "@/entities/announcement/model"
import styles from "./AnnouncementHeader.module.css"

interface AnnouncementHeaderProps {
  announcement: Conference | Webinar | MasterClass | Vacancy | Olympiad
}

export const AnnouncementHeader: React.FC<AnnouncementHeaderProps> = ({ announcement }) => {
  const getOlympiadLevelBadge = (level: string) => {
    const translations: Record<string, string> = {
      intrauniversity: "Внутривузовская",
      regional: "Региональная",
      national: "Всероссийская",
      international: "Международная",
    }
    return translations[level] || level
  }

  return (
    <div className={styles.header}>
      <div className={styles.badges}>
        <span className={styles.typeBadge}>
          {categoryTypeTranslations[announcement.type as keyof typeof categoryTypeTranslations] || announcement.type}
        </span>
        {announcement.isPromoted && <span className={styles.promotedBadge}>Рекомендуемое</span>}
        {announcement.type === "Vacancy" && (announcement as Vacancy).urgent && (
          <span className={styles.urgentBadge}>Срочно</span>
        )}
        {announcement.type === "Vacancy" && (announcement as Vacancy).featured && (
          <span className={styles.featuredBadge}>Топ вакансия</span>
        )}
        {announcement.type === "Olimpiad" && (
          <span className={styles.promotedBadge}>
            {getOlympiadLevelBadge((announcement as Olympiad).olympiadLevel)}
          </span>
        )}
      </div>

      <h1 className={styles.title}>{announcement.title}</h1>

      <div className={styles.organizer}>
        Организатор: <span className={styles.organizerName}>{announcement.organizerName}</span>
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
