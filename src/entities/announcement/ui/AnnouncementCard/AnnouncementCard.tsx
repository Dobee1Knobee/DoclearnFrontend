import type React from "react"
import { Calendar, MapPin, Briefcase } from "lucide-react"
import styles from "./AnnouncementCard.module.css"
import type { Conference, Webinar, MasterClass, Vacancy, AnnouncementCategory, Olympiad } from "../../model/index"
import { formatPrice, formatDate, getLocationText, translateCategory } from "@/shared/lib/formatters"

interface AnnouncementCardProps {
  announcement: Conference | Webinar | MasterClass | Vacancy | Olympiad
  variant?: "default" | "compact"
  className?: string
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  variant = "default",
  className = "",
}) => {
  const { categories = [], location } = announcement

  const isVacancy = announcement.type === "Vacancy"
  const isEvent =
    announcement.type === "Conference" || announcement.type === "Webinar" || announcement.type === "Masterclass"

  const cardClass = `${styles.card} ${variant === "compact" ? styles.compact : ""} ${className}`

  const formatVacancySalary = (salary: any) => {
    if (!salary) return "По договоренности"

    const { min, max, currency, negotiable } = salary
    let result = ""

    if (min && max) {
      result = `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`
    } else if (min) {
      result = `от ${min.toLocaleString()} ${currency}`
    } else if (max) {
      result = `до ${max.toLocaleString()} ${currency}`
    }

    return result || "По договоренности"
  }

  return (
    <div className={cardClass}>
      {variant !== "compact" && (
        <div className={styles.imageContainer}>
          <img src={announcement.previewImage || "/placeholder.webp"} alt={announcement.title} className={styles.image} />
          {announcement.isPromoted && <div className={styles.promotedBadge}>Рекомендуемое</div>}
          {isVacancy && (announcement as Vacancy).urgent && <div className={styles.urgentBadge}>Срочно</div>}
          {isVacancy && (announcement as Vacancy).featured && <div className={styles.featuredBadge}>Топ</div>}
        </div>
      )}

      <div className={styles.content}>
        {variant === "compact" && (
          <div className={styles.badges}>
            {announcement.isPromoted && <div className={styles.promotedBadge}>Рекомендуемое</div>}
            {isVacancy && (announcement as Vacancy).urgent && <div className={styles.urgentBadge}>Срочно</div>}
            {isVacancy && (announcement as Vacancy).featured && <div className={styles.featuredBadge}>Топ</div>}
          </div>
        )}

        <h3 className={styles.title}>{announcement.title}</h3>
        <p className={styles.organizer}>{announcement.organizerName}</p>

        <div className={styles.details}>
          <div className={styles.dateLocationRow}>
            {isVacancy ? (
              <>
                {/* <div className={styles.detailItem}>
                  <Briefcase size={16} className={styles.icon} />
                  <span>{(announcement as Vacancy).position}</span>
                </div> */}
                {location && (
                  <div className={styles.detailItem}>
                    <MapPin size={16} className={styles.icon} />
                    <span>{getLocationText(location) || (announcement as Vacancy).workFormat}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.detailItem}>
                  <Calendar size={16} className={styles.icon} />
                  <span>{formatDate(announcement.activeFrom)}</span>
                </div>

                {location && (
                  <div className={styles.detailItem}>
                    <MapPin size={16} className={styles.icon} />
                    <span>{getLocationText(location) || 
                      (isEvent ? (announcement as Conference | Webinar | MasterClass).format : "")}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {categories.length > 0 && (
            <div className={styles.categoriesRow}>
              {categories.map((category: AnnouncementCategory, index: number) => (
                <span key={index} className={styles.categoryTag}>
                  {translateCategory(category)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>
            {isVacancy
              ? formatVacancySalary((announcement as Vacancy).salary)
              : isEvent
                ? formatPrice(
                    (announcement as Conference | Webinar | MasterClass).price,
                    (announcement as Conference | Webinar | MasterClass).price_type,
                    (announcement as Conference | Webinar | MasterClass).currency,
                  )
                : "Цена не указана"}
          </div>
        </div>
      </div>
    </div>
  )
}
