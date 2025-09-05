"use client"

import { Calendar, MapPin, Clock, Users, Globe } from "lucide-react"
import type { CreateAnnouncementFormData } from "@/entities/announcement/model"
import { 
  targetAudienceTranslations, 
  categoryTranslations, 
  currencyTranslations,
  categoryTypeTranslations,
  languageTranslations,
  locationTypeTranslations,
  skillLevelTranslations,
} from "@/shared/lib/translations"
import styles from "./PreviewAndPublish.module.css"

interface PreviewAndPublishProps {
  formData: CreateAnnouncementFormData
  onUpdate: (updates: Partial<CreateAnnouncementFormData>) => void
  onSubmit: () => void
  onPrevious: () => void
}

export function PreviewAndPublish({ formData, onUpdate, onSubmit, onPrevious }: PreviewAndPublishProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    return timeString
  }

  const getPriceText = () => {
    if (formData.price_type === "free") {
      return "Бесплатно"
    }
    if (formData.price && formData.currency) {
      const currencySymbol =
        currencyTranslations[formData.currency as keyof typeof currencyTranslations] || formData.currency
      return `${formData.price} ${currencySymbol}`
    }
    return "Цена не указана"
  }

  const getTranslatedTargetAudience = () => {
    return formData.targetAudience
      .map((audience) => targetAudienceTranslations[audience as keyof typeof targetAudienceTranslations] || audience)
      .join(", ")
  }

  const getTranslatedCategories = () => {
    if (!formData.categories || formData.categories.length === 0) return "Не указаны"
    return formData.categories
      .map((category) => categoryTranslations[category as keyof typeof categoryTranslations] || category)
      .join(", ")
  }

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Превью и публикация</h2>
        <p className={styles.stepDescription}>Проверьте данные перед публикацией объявления</p>
      </div>

      <div className={styles.previewCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardBadges}>
            {formData.certificates && <div className={styles.certificatesBadge}>Сертификат</div>}
          </div>
          <div className={styles.promotedToggle}>
            <label className={styles.promotedLabel}>
              <input
                type="checkbox"
                style={{ accentColor: "#5388d8" }}
                checked={formData.isPromoted}
                onChange={(e) => onUpdate({ isPromoted: e.target.checked })}
              />
              Продвигать объявление
            </label>
          </div>
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{formData.title || "Название мероприятия"}</h3>
          <p className={styles.cardOrganizer}>{formData.organizer || "Организатор"}</p>

          <div className={styles.cardDetailsGrid}>
            <div className={styles.detailItem}>
              <Calendar size={16} className={styles.icon}/>
              <span>
                {formatDate(formData.activeFrom)}
                {formData.activeTo &&
                  formData.activeTo !== formData.activeFrom &&
                  ` - ${formatDate(formData.activeTo)}`}
              </span>
            </div>

            {formData.location.city && (
              <div className={styles.detailItem}>
                <MapPin size={16} className={styles.icon}/>
                <span>{formData.location.city}</span>
              </div>
            )}

            <div className={styles.detailItem}>
              <Clock size={16} className={styles.icon}/>
              <span>
                {formatTime(formData.startTime)}
                {formData.endTime && ` - ${formatTime(formData.endTime)}`}
              </span>
            </div>

            <div className={styles.detailItem}>
              <Globe size={16} className={styles.icon}/>
              <span>
                {locationTypeTranslations[formData.location.type as keyof typeof locationTypeTranslations] ||
                  formData.location.type}
              </span>
            </div>

            {(formData.maxParticipants || formData.participantLimit) && (
              <div className={styles.detailItem}>
                <Users size={16} className={styles.icon}/>
                <span>До {formData.maxParticipants || formData.participantLimit} участников</span>
              </div>
            )}
          </div>

          {formData.categories && formData.categories.length > 0 && (
            <div className={styles.cardTags}>
              {formData.categories.map((category) => (
                <span key={category} className={styles.cardTag}>
                  {categoryTranslations[category as keyof typeof categoryTranslations] || category}
                </span>
              ))}
            </div>
          )}

          <div className={styles.cardPrice}>{getPriceText()}</div>
        </div>
      </div>

      <div className={styles.summarySection}>
        <h4 className={styles.summaryTitle}>Сводка данных</h4>
        <div className={styles.summaryGrid}>
          {formData.description && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Описание:</span>
              <span className={styles.summaryValue}>{formData.description}</span>
            </div>
          )}

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Тип мероприятия:</span>
            <span className={styles.summaryValue}>
              {categoryTypeTranslations[formData.category as keyof typeof categoryTypeTranslations] ||
                formData.category ||
                "Не выбран"}
            </span>
          </div>

          {formData.categories && formData.categories.length > 0 && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Категории:</span>
              <span className={styles.summaryValue}>{getTranslatedCategories()}</span>
            </div>
          )}

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Язык:</span>
            <span className={styles.summaryValue}>
              {languageTranslations[formData.language as keyof typeof languageTranslations] || formData.language}
            </span>
          </div>

          {formData.targetAudience.length > 0 && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Целевая аудитория:</span>
              <span className={styles.summaryValue}>{getTranslatedTargetAudience()}</span>
            </div>
          )}

          {formData.category === "conference" && formData.program && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Программа:</span>
              <span className={styles.summaryValue}>{formData.program}</span>
            </div>
          )}

          {formData.location.address && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Адрес:</span>
              <span className={styles.summaryValue}>{formData.location.address}</span>
            </div>
          )}

          {formData.tags && formData.tags.length > 0 && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Теги:</span>
              <span className={styles.summaryValue}>{formData.tags.join(", ")}</span>
            </div>
          )}

          {formData.certificates && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Сертификаты:</span>
              <span className={styles.summaryValue}>Да</span>
            </div>
          )}

          {formData.category === "masterclass" && (
            <>
              {formData.skillLevel && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Уровень сложности:</span>
                  <span className={styles.summaryValue}>
                    {skillLevelTranslations[formData.skillLevel as keyof typeof skillLevelTranslations] ||
                      formData.skillLevel}
                  </span>
                </div>
              )}
              {formData.duration && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Продолжительность (часы):</span>
                  <span className={styles.summaryValue}>{formData.duration}</span>
                </div>
              )}
              {formData.equipment && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Предоставляемое оборудование:</span>
                  <span className={styles.summaryValue}>{formData.equipment}</span>
                </div>
              )}
              {formData.prerequisites && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Предварительные требования:</span>
                  <span className={styles.summaryValue}>{formData.prerequisites}</span>
                </div>
              )}
              {formData.materials && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Необходимые материалы:</span>
                  <span className={styles.summaryValue}>{formData.materials}</span>
                </div>
              )}
              {formData.handsOn !== undefined && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Практические занятия:</span>
                  <span className={styles.summaryValue}>{formData.handsOn ? "Да" : "Нет"}</span>
                </div>
              )}
              {formData.groupWork !== undefined && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Групповая работа:</span>
                  <span className={styles.summaryValue}>{formData.groupWork ? "Да" : "Нет"}</span>
                </div>
              )}
            </>
          )}

          {formData.category === "webinar" && (
            <>
              {formData.isRecorded !== undefined && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Запись доступна:</span>
                  <span className={styles.summaryValue}>{formData.isRecorded ? "Да" : "Нет"}</span>
                </div>
              )}
              {formData.isRecorded && formData.recordingLink && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Ссылка на запись:</span>
                  <span className={styles.summaryValue}>{formData.recordingLink}</span>
                </div>
              )}
              {formData.isRecorded && formData.recordingAvailableUntil && (
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Запись доступна до:</span>
                  <span className={styles.summaryValue}>{formatDate(formData.recordingAvailableUntil)}</span>
                </div>
              )}
            </>
          )}

          {formData.speakers.length > 0 && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Спикеры:</span>
              <span className={styles.summaryValue}>
                {formData.speakers.map((speaker) => `${speaker.name} (${speaker.eventRole})`).join(", ")}
              </span>
            </div>
          )}

          {formData.contactInfo.email && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Email:</span>
              <span className={styles.summaryValue}>{formData.contactInfo.email}</span>
            </div>
          )}

          {formData.contactInfo.phone && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Телефон:</span>
              <span className={styles.summaryValue}>{formData.contactInfo.phone}</span>
            </div>
          )}

          {formData.registrationLink && (
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Ссылка для регистрации:</span>
              <span className={styles.summaryValue}>{formData.registrationLink}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={onPrevious} className={styles.backButton}>
          Назад
        </button>
        <button onClick={onSubmit} className={styles.publishButton}>
          Опубликовать объявление
        </button>
      </div>
    </div>
  )
}
