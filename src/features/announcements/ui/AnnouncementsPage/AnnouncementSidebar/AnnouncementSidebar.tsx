import type React from "react"
import {
  Calendar,
  MapPin,
  CreditCard,
  Users,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Clock,
  Briefcase,
  Trophy,
  Target,
} from "lucide-react"
import { formatPrice, formatDate } from "@/shared/lib/formatters"
import type { Conference, Webinar, MasterClass, Vacancy, Olympiad } from "@/entities/announcement/model"
import styles from "./AnnouncementSidebar.module.css"

interface AnnouncementSidebarProps {
  announcement: Conference | Webinar | MasterClass | Vacancy | Olympiad
}

export const AnnouncementSidebar: React.FC<AnnouncementSidebarProps> = ({ announcement }) => {
  const getLocationDetails = () => {
    if (!announcement.location) return null

    const format =
      announcement.type !== "Vacancy" && announcement.type !== "Olimpiad"
        ? (announcement as Conference | Webinar | MasterClass).format
        : announcement.type === "Vacancy"
          ? (announcement as Vacancy).workFormat
          : "offline"

    if (format === "online") {
      return { text: "Онлайн мероприятие", address: null }
    }

    if (format === "hybrid") {
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

    if (negotiable) {
      result += " (торг)"
    }

    return result || "По договоренности"
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Основная информация</h3>

        {announcement.type === "Vacancy" ? (
          <>
            <div className={styles.infoItem}>
              <Briefcase size={18} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Должность</div>
                <div className={styles.infoValue}>{(announcement as Vacancy).position}</div>
              </div>
            </div>

            <div className={styles.infoItem}>
              <CreditCard size={18} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Зарплата</div>
                <div className={styles.price}>{formatVacancySalary((announcement as Vacancy).salary)}</div>
              </div>
            </div>

            {location && (
              <div className={styles.infoItem}>
                <MapPin size={18} className={styles.icon} />
                <div>
                  <div className={styles.infoLabel}>Место работы</div>
                  <div className={styles.infoValue}>{location.text}</div>
                  {location.address && <div className={styles.infoAddress}>{location.address}</div>}
                </div>
              </div>
            )}

            {(announcement as Vacancy).applicationDeadline && (
              <div className={styles.infoItem}>
                <Clock size={18} className={styles.icon} />
                <div>
                  <div className={styles.infoLabel}>Срок подачи заявок</div>
                  <div className={styles.infoValue}>{formatDate((announcement as Vacancy).applicationDeadline!)}</div>
                </div>
              </div>
            )}
          </>
        ) : announcement.type === "Olimpiad" ? (
          <>
            <div className={styles.infoItem}>
              <Trophy size={18} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Уровень олимпиады</div>
                <div className={styles.infoValue}>
                  {(announcement as Olympiad).olympiadLevel === "intrauniversity"
                    ? "Внутривузовская"
                    : (announcement as Olympiad).olympiadLevel === "regional"
                      ? "Региональная"
                      : (announcement as Olympiad).olympiadLevel === "national"
                        ? "Всероссийская"
                        : "Международная"}
                </div>
              </div>
            </div>

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
                <div className={styles.infoLabel}>Участие</div>
                <div className={styles.price}>
                  {(announcement as Olympiad).price_type === "free"
                    ? "Бесплатно"
                    : `${(announcement as Olympiad).price} ${(announcement as Olympiad).currency}`}
                </div>
              </div>
            </div>

            {(announcement as Olympiad).maxParticipants && (
              <div className={styles.infoItem}>
                <Users size={18} className={styles.icon} />
                <div>
                  <div className={styles.infoLabel}>Участники</div>
                  <div className={styles.infoValue}>
                    {(announcement as Olympiad).currentParticipants || 0} из{" "}
                    {(announcement as Olympiad).maxParticipants}
                  </div>
                </div>
              </div>
            )}

            {(announcement as Olympiad).registrationCloseAt && (
              <div className={styles.infoItem}>
                <Clock size={18} className={styles.icon} />
                <div>
                  <div className={styles.infoLabel}>Регистрация до</div>
                  <div className={styles.infoValue}>{formatDate((announcement as Olympiad).registrationCloseAt!)}</div>
                </div>
              </div>
            )}

            <div className={styles.infoItem}>
              <Target size={18} className={styles.icon} />
              <div>
                <div className={styles.infoLabel}>Формат участия</div>
                <div className={styles.infoValue}>
                  {(announcement as Olympiad).competitionFormat === "individual"
                    ? "Индивидуальный"
                    : (announcement as Olympiad).competitionFormat === "team"
                      ? "Командный"
                      : "Индивидуальный и командный"}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
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
                <div className={styles.price}>
                  {formatPrice(
                    (announcement as Conference | Webinar | MasterClass).price,
                    (announcement as Conference | Webinar | MasterClass).price_type,
                    (announcement as Conference | Webinar | MasterClass).currency,
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {announcement.type === "Conference" && (
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

        {announcement.type === "Masterclass" && (
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

        {announcement.type === "Webinar" && (announcement as Webinar).participantLimit && (
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
            {announcement.type === "Vacancy"
              ? "Откликнуться"
              : announcement.type === "Olimpiad"
                ? "Зарегистрироваться на олимпиаду"
                : "Зарегистрироваться"}
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {announcement.type === "Webinar" && (announcement as Webinar).isRecorded && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Запись</h3>
          <p className={styles.recordingInfo}>
            Запись вебинара будет доступна после мероприятия
            {(announcement as Webinar).recordingAvailableUntil &&
              ` до ${formatDate((announcement as Webinar).recordingAvailableUntil!)}`}
          </p>
        </div>
      )}

      {announcement.type === "Olimpiad" && (announcement as Olympiad).docs && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Документы</h3>
          {(announcement as Olympiad).docs!.rulesUrl && (
            <div className={styles.contactItem}>
              <Globe size={16} className={styles.contactIcon} />
              <a
                href={(announcement as Olympiad).docs!.rulesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                Положение об олимпиаде
                <ExternalLink size={14} className={styles.externalIcon} />
              </a>
            </div>
          )}
          {(announcement as Olympiad).docs!.syllabusUrl && (
            <div className={styles.contactItem}>
              <Globe size={16} className={styles.contactIcon} />
              <a
                href={(announcement as Olympiad).docs!.syllabusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                Программа олимпиады
                <ExternalLink size={14} className={styles.externalIcon} />
              </a>
            </div>
          )}
          {(announcement as Olympiad).docs!.scheduleUrl && (
            <div className={styles.contactItem}>
              <Globe size={16} className={styles.contactIcon} />
              <a
                href={(announcement as Olympiad).docs!.scheduleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                Расписание
                <ExternalLink size={14} className={styles.externalIcon} />
              </a>
            </div>
          )}
          {(announcement as Olympiad).docs!.pastPapersUrl && (
            <div className={styles.contactItem}>
              <Globe size={16} className={styles.contactIcon} />
              <a
                href={(announcement as Olympiad).docs!.pastPapersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                Архив заданий
                <ExternalLink size={14} className={styles.externalIcon} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
