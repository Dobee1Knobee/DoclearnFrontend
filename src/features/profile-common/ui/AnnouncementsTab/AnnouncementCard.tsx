"use client"

import type React from "react"
import { Calendar, MapPin } from "lucide-react"
import styles from "./AnnouncementCard.module.css"
import type { Conference, Webinar, MasterClass } from "@/entities/announcement/model/index"

interface AnnouncementCardProps {
  announcement: Conference | Webinar | MasterClass
  onManage?: (id: string) => void
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onManage }) => {
  const { categories = [], location } = announcement

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
  }

  const getLocationText = (loc: any) => {
    if (!loc) return null
    if (typeof loc === "string") return loc
    return loc.city || loc.address || null
  }

  const formatPrice = (price: number, priceType: string, currency: string) => {
    if (priceType === "free") return "Бесплатно"
    if (!price) return "Цена не указана"
    return `${price.toLocaleString()} ${currency}`
  }

  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
      medical: "Медицина",
      it: "IT",
      educational: "Образование",
    }
    return translations[category] || category
  }

  const handleManageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onManage) {
      onManage(announcement.id)
    }
  }

  return (
    <div className={styles.card}>
      {announcement.isPromoted && (
        <div className={styles.badges}>
          <div className={styles.promotedBadge}>Рекомендуемое</div>
        </div>
      )}
      <h3 className={styles.title}>{announcement.title}</h3>
      <p className={styles.organizer}>{announcement.organizerName}</p>

      <div className={styles.details}>
        <div className={styles.dateLocationRow}>
          <div className={styles.detailItem}>
            <Calendar size={16} className={styles.icon} />
            <span>{formatDate(announcement.activeFrom)}</span>
          </div>

          {location && (
            <div className={styles.detailItem}>
              <MapPin size={16} className={styles.icon} />
              <span>{getLocationText(location) || announcement.format}</span>
            </div>
          )}
        </div>

        {categories.length > 0 && (
          <div className={styles.categoriesRow}>
            {categories.map((category, index) => (
              <span key={index} className={styles.categoryTag}>
                {translateCategory(category)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.price}>
        {formatPrice(announcement.price, announcement.price_type, announcement.currency)}
      </div>


      <div className={styles.footer}>
        <button className={styles.manageButton} onClick={handleManageClick}>
          Управлять
        </button>
      </div>
    </div>
  )
}
