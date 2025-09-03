import type React from "react"
import { Calendar, MapPin } from "lucide-react"
import styles from "./AnnouncementCard.module.css"
import type { Conference, Webinar, Course, MasterClass, Vacancy, Internship } from "../../model/index"

interface AnnouncementCardProps {
  announcement: Conference | Webinar | Course | MasterClass | Vacancy | Internship
  variant?: "default" | "compact"
  className?: string
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  variant = "default",
  className = "",
}) => {
  const isConference = announcement.type === "conference"
  const isWebinar = announcement.type === "webinar"
  const isCourse = announcement.type === "course"
  const isMasterClass = announcement.type === "masterclass"
  const isVacancy = announcement.type === "vacancy"
  const isInternship = announcement.type === "internship"

  const getPrice = () => {
    if (isConference) return (announcement as Conference).price
    if (isWebinar) return (announcement as Webinar).price
    if (isCourse) return (announcement as Course).price
    if (isMasterClass) return (announcement as MasterClass).price
    if (isVacancy) {
      const vacancy = announcement as Vacancy
      if (vacancy.salary.min && vacancy.salary.max) {
        return `${vacancy.salary.min.toLocaleString()} - ${vacancy.salary.max.toLocaleString()}`
      }
      return vacancy.salary.negotiable ? "По договоренности" : "Не указана"
    }
    if (isInternship) {
      const internship = announcement as Internship
      return internship.isPaid && internship.stipend ? internship.stipend : 0
    }
    return 0
  }

  const getCurrency = () => {
    if (isConference) return (announcement as Conference).currency
    if (isWebinar) return (announcement as Webinar).currency
    if (isCourse) return (announcement as Course).currency
    if (isMasterClass) return (announcement as MasterClass).currency
    if (isVacancy) return (announcement as Vacancy).salary.currency
    if (isInternship) return (announcement as Internship).currency || "RUB"
    return "RUB"
  }

  const formatPrice = (price: number | string, currency: string) => {
    if (typeof price === "string") return price
    if (price === 0) return "Бесплатно"
    return `₽ ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getLocationText = () => {
    if (!announcement.location) return ""
    if (announcement.location.type === "online") return "Онлайн"
    if (announcement.location.type === "hybrid") return "Гибрид"
    return announcement.location.city || "Офлайн"
  }

  const getCategories = () => {
    if (isConference || isWebinar || isCourse || isMasterClass) {
      const categories = (announcement as any).categories
      return categories || []
    }
    if (isVacancy || isInternship) {
      const categories = (announcement as any).categories
      return categories || []
    }
    return []
  }

  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
      medical: "Медицина",
      it: "IT",
      educational: "Образование",
      business: "Бизнес",
      science: "Наука",
      other: "Другое",
    }
    return translations[category] || category
  }

  const getCategory = () => {
    const categories = getCategories()
    return categories && categories.length > 0 ? categories[0] : ""
  }

  const cardClass = `${styles.card} ${variant === "compact" ? styles.compact : ""} ${className}`

  return (
    <div className={cardClass}>
      {variant !== "compact" && (
        <div className={styles.imageContainer}>
          <img src={"/placeholder.webp"} alt={announcement.title} className={styles.image} />
          {announcement.isPromoted && <div className={styles.promotedBadge}>Срочно</div>}
        </div>
      )}

      <div className={styles.content}>
        {variant === "compact" && (
          <div className={styles.badges}>
            {announcement.isPromoted && <div className={styles.promotedBadge}>Срочно</div>}
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

            {announcement.location && (
              <div className={styles.detailItem}>
                <MapPin size={16} className={styles.icon} />
                <span>{getLocationText()}</span>
              </div>
            )}
          </div>

          {getCategories().length > 0 && (
            <div className={styles.categoriesRow}>
              {getCategories().map((category: string, index: number) => (
                <span key={index} className={styles.categoryTag}>
                  {translateCategory(category)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>{formatPrice(getPrice(), getCurrency())}</div>
        </div>
      </div>
    </div>
  )
}
