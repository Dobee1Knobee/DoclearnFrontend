import type React from "react"
import { Calendar, MapPin, CreditCard, Users, Phone, Mail, Globe, ExternalLink } from "lucide-react"
import { formatPrice, formatDate } from "@/shared/lib/formatters"
import type { Conference, Webinar, MasterClass } from "@/entities/announcement/model"
import styles from "./AnnouncementSidebar.module.css"

interface AnnouncementSidebarProps {
  announcement: Conference | Webinar | MasterClass
}

export const AnnouncementSidebar: React.FC<AnnouncementSidebarProps> = ({ announcement }) => {
  const getLocationDetails = () => {
    if (!announcement.location) return null

    if (announcement.location.type === "online") {
      return { text: "Онлайн мероприятие", address: null }
    }

    if (announcement.location.type === "hybrid") {
      return {
        text: "Гибридный формат",
        address: announcement.location.address || announcement.location.city,
      }
    }

    return {
      text: announcement.location.city || "Офлайн",
      address: announcement.location.address,
    }
  }

  const location = getLocationDetails()

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Основная информация</h3>

        <div className={styles.infoItem}>
          <Calendar size={18} className={styles.icon} />
          <div>
            <div className={styles.infoLabel}>Дата проведения</div>
            <div className={styles.infoValue}>
              {formatDate(announcement.activeFrom)}
              {announcement.activeTo && ` - ${formatDate(announcement.activeTo)}`}
            </div>
          </div>
        </div>

        {location && (
          <div className={styles.infoItem}>
            <MapPin size={18} className={styles.icon} />
            <div>
              <div className={styles.infoLabel}>Место проведения</div>
              <div className={styles.infoValue}>{location.text}</div>
              {location.address && <div className={styles.infoAddress}>{location.address}</div>}
            </div>
          </div>
        )}

        <div className={styles.infoItem}>
          <CreditCard size={18} className={styles.icon} />
          <div>
            <div className={styles.infoLabel}>Стоимость</div>
            <div className={styles.price}>{formatPrice(announcement.price, announcement.price_type, announcement.currency)}</div>
          </div>
        </div>

        {announcement.type === "conference" && (
          <div className={styles.infoItem}>
            <Users size={18} className={styles.icon} />
            <div>
              <div className={styles.infoLabel}>Участники</div>
              <div className={styles.infoValue}>
                {(announcement as Conference).currentParticipants}
                {(announcement as Conference).maxParticipants && ` из ${(announcement as Conference).maxParticipants}`}
              </div>
            </div>
          </div>
        )}

        {announcement.type === "masterclass" && (
          <div className={styles.infoItem}>
            <Users size={18} className={styles.icon} />
            <div>
              <div className={styles.infoLabel}>Участники</div>
              <div className={styles.infoValue}>
                {(announcement as MasterClass).currentParticipants} из {(announcement as MasterClass).maxParticipants}
              </div>
            </div>
          </div>
        )}

        {announcement.type === "webinar" && (announcement as Webinar).participantLimit && (
          <div className={styles.infoItem}>
            <Users size={18} className={styles.icon} />
            <div>
              <div className={styles.infoLabel}>Лимит участников</div>
              <div className={styles.infoValue}>{(announcement as Webinar).participantLimit} человек</div>
            </div>
          </div>
        )}
      </div>

      {announcement.contactInfo && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Контакты</h3>

          {announcement.contactInfo.email && (
            <div className={styles.contactItem}>
              <Mail size={16} className={styles.contactIcon} />
              <a href={`mailto:${announcement.contactInfo.email}`} className={styles.contactLink}>
                {announcement.contactInfo.email}
              </a>
            </div>
          )}

          {announcement.contactInfo.phone && (
            <div className={styles.contactItem}>
              <Phone size={16} className={styles.contactIcon} />
              <a href={`tel:${announcement.contactInfo.phone}`} className={styles.contactLink}>
                {announcement.contactInfo.phone}
              </a>
            </div>
          )}

          {announcement.contactInfo.website && (
            <div className={styles.contactItem}>
              <Globe size={16} className={styles.contactIcon} />
              <a
                href={announcement.contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                Официальный сайт
                <ExternalLink size={14} className={styles.externalIcon} />
              </a>
            </div>
          )}
        </div>
      )}

      {(announcement as any).registrationLink && (
        <div className={styles.card}>
          <a
            href={(announcement as any).registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.registerButton}
          >
            Зарегистрироваться
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {announcement.type === "webinar" && (announcement as Webinar).isRecorded && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Запись</h3>
          <p className={styles.recordingInfo}>
            Запись вебинара будет доступна после мероприятия
            {(announcement as Webinar).recordingAvailableUntil &&
              ` до ${formatDate((announcement as Webinar).recordingAvailableUntil!)}`}
          </p>
        </div>
      )}
    </div>
  )
}
