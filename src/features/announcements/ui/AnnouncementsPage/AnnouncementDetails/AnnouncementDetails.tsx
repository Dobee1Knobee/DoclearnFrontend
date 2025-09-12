import type React from "react"
import { BookOpen, Users, Award, Zap, Monitor, Video } from "lucide-react"
import { targetAudienceTranslations, categoryTranslations } from "@/shared/lib/translations"
import type { Conference, Webinar, MasterClass } from "@/entities/announcement/model"
import styles from "./AnnouncementDetails.module.css"

interface AnnouncementDetailsProps {
  announcement: Conference | Webinar | MasterClass
}

export const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({ announcement }) => {
  const isConference = announcement.type === "conference"
  const isWebinar = announcement.type === "webinar"
  const isMasterClass = announcement.type === "masterclass"

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

  const translateAudience = (audience: string) => {
    const translations: Record<string, string> = {
      doctors: "Врачи",
      students: "Студенты",
      researchers: "Исследователи",
      specialists: "Специалисты",
      general: "Широкая аудитория",
    }
    return translations[audience] || audience
  }

  const translateSkillLevel = (level: string) => {
    const translations: Record<string, string> = {
      beginner: "Начинающий",
      intermediate: "Средний",
      advanced: "Продвинутый",
    }
    return translations[level] || level
  }

  const translatePlatform = (platform: string) => {
    const translations: Record<string, string> = {
      zoom: "Zoom",
      teams: "Microsoft Teams",
      youtube: "YouTube",
      google_meet: "Google Meet",
      yandex: "Yandex Телемост",
      other: "Другая платформа",
    }
    return translations[platform] || platform
  }

  return (
    <div className={styles.details}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Описание</h2>
        <p className={styles.description}>{announcement.description}</p>
      </section>

      {isConference && (announcement as Conference).program && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={20} className={styles.sectionIcon} />
            Программа мероприятия
          </h2>
          <div className={styles.program}>
            {(announcement as Conference).program!.split("\n").map((line, index) => (
              <p key={index} className={styles.programLine}>
                {line}
              </p>
            ))}
          </div>
        </section>
      )}

      {isMasterClass && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} className={styles.sectionIcon} />
              Детали мастер-класса
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Уровень сложности:</span>
                <span className={styles.detailValue}>
                  {translateSkillLevel((announcement as MasterClass).skillLevel)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Продолжительность:</span>
                <span className={styles.detailValue}>{(announcement as MasterClass).duration} часов</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Максимум участников:</span>
                <span className={styles.detailValue}>{(announcement as MasterClass).maxParticipants} человек</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Текущее количество:</span>
                <span className={styles.detailValue}>{(announcement as MasterClass).currentParticipants} человек</span>
              </div>
            </div>
          </section>

          {(announcement as MasterClass).materials && (announcement as MasterClass).materials!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={20} className={styles.sectionIcon} />
                Необходимые материалы
              </h2>
              <ul className={styles.list}>
                {(announcement as MasterClass).materials!.map((material, index) => (
                  <li key={index} className={styles.listItem}>
                    {material}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(announcement as MasterClass).equipment && (announcement as MasterClass).equipment!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Monitor size={20} className={styles.sectionIcon} />
                Предоставляемое оборудование
              </h2>
              <ul className={styles.list}>
                {(announcement as MasterClass).equipment!.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(announcement as MasterClass).prerequisites && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Предварительные требования</h2>
              <p className={styles.prerequisites}>{(announcement as MasterClass).prerequisites}</p>
            </section>
          )}
        </>
      )}

      {isWebinar && (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Video size={20} className={styles.sectionIcon} />
              Детали вебинара
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Платформа:</span>
                <span className={styles.detailValue}>{translatePlatform((announcement as Webinar).platform)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Продолжительность:</span>
                <span className={styles.detailValue}>{(announcement as Webinar).duration} минут</span>
              </div>
              {(announcement as Webinar).participantLimit && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Лимит участников:</span>
                  <span className={styles.detailValue}>{(announcement as Webinar).participantLimit} человек</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Запись:</span>
                <span className={styles.detailValue}>
                  {(announcement as Webinar).isRecorded ? "Будет доступна" : "Не предусмотрена"}
                </span>
              </div>
            </div>
          </section>

          {(announcement as Webinar).prerequisites && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Предварительные требования</h2>
              <p className={styles.prerequisites}>{(announcement as Webinar).prerequisites}</p>
            </section>
          )}

          {(announcement as Webinar).materials && (announcement as Webinar).materials!.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <BookOpen size={20} className={styles.sectionIcon} />
                Материалы
              </h2>
              <ul className={styles.list}>
                {(announcement as Webinar).materials!.map((material, index) => (
                  <li key={index} className={styles.listItem}>
                    {material}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Users size={20} className={styles.sectionIcon} />
          Дополнительная информация
        </h2>
        <div className={styles.detailsGrid}>
          {announcement.categories && announcement.categories.length > 0 && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Категории:</span>
              <div className={styles.categories}>
                {announcement.categories.map((category, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {translateCategory(category)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(announcement as any).targetAudience && (announcement as any).targetAudience.length > 0 && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Целевая аудитория:</span>
              <div className={styles.audience}>
                {(announcement as any).targetAudience.map((audience: string, index: number) => (
                  <span key={index} className={styles.audienceTag}>
                    {translateAudience(audience)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Язык проведения:</span>
            <span className={styles.detailValue}>
              {(announcement as any).language === "ru"
                ? "Русский"
                : (announcement as any).language === "en"
                  ? "Английский"
                  : "Многоязычный"}
            </span>
          </div>

          {(announcement as any).certificates && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Сертификаты:</span>
              {/* <Award size={16} className={styles.certificateIcon} /> */}
              <span className={styles.certificateText}>Выдаются</span>
            </div>
          )}
        </div>
      </section>

      {announcement.tags && announcement.tags.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Теги</h2>
          <div className={styles.tags}>
            {announcement.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
