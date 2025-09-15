import type React from "react"
import { Calendar, MapPin } from "lucide-react"
import styles from "./AnnouncementCard.module.css"
import type { Conference, Webinar, MasterClass, AnnouncementCategory } from "../../model/index"
import { formatPrice, formatDate, getLocationText, translateCategory } from "@/shared/lib/formatters"

interface AnnouncementCardProps {
  announcement: Conference | Webinar | MasterClass
  variant?: "default" | "compact"
  className?: string
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  variant = "default",
  className = "",
}) => {
  const { price, price_type, currency, categories = [], location } = announcement

  const cardClass = `${styles.card} ${variant === "compact" ? styles.compact : ""} ${className}`

  return (
    <div className={cardClass}>
      {variant !== "compact" && (
        <div className={styles.imageContainer}>
          <img src={"/placeholder.webp"} alt={announcement.title} className={styles.image} />
          {announcement.isPromoted && <div className={styles.promotedBadge}>Рекомендуемое</div>}
        </div>
      )}

      <div className={styles.content}>
        {variant === "compact" && (
          <div className={styles.badges}>
            {announcement.isPromoted && <div className={styles.promotedBadge}>Рекомендуемое</div>}
          </div>
        )}

        <h3 className={styles.title}>{announcement.title}</h3>
        <p className={styles.organizer}>{announcement.organizer}</p>

        <div className={styles.details}>
          <div className={styles.dateLocationRow}>
            <div className={styles.detailItem}>
              <Calendar size={16} className={styles.icon} />
              <span>{formatDate(announcement.activeFrom)}</span>
            </div>

            {location && (
              <div className={styles.detailItem}>
                <MapPin size={16} className={styles.icon} />
                <span>{getLocationText(location)}</span>
              </div>
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
          <div className={styles.price}>{formatPrice(price, price_type, currency)}</div>
        </div>
      </div>
    </div>
  )
}
