import type React from "react"
import { User, CheckCircle, Clock, XCircle } from "lucide-react"
import type { Speaker } from "@/entities/announcement/model"
import styles from "./SpeakersSection.module.css"

interface SpeakersSectionProps {
  speakers: Speaker[]
}

export const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakers }) => {
  const getStatusIcon = (status: Speaker["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} className={styles.confirmedIcon} />
      case "pending":
        return <Clock size={16} className={styles.pendingIcon} />
      case "declined":
        return <XCircle size={16} className={styles.declinedIcon} />
      default:
        return null
    }
  }

  const getStatusText = (status: Speaker["status"]) => {
    switch (status) {
      case "confirmed":
        return "Подтверждено"
      case "pending":
        return "Ожидает подтверждения"
      case "declined":
        return "Отклонено"
      default:
        return ""
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Спикеры</h2>
      <div className={styles.speakersGrid}>
        {speakers.map((speaker, index) => (
          <div key={index} className={styles.speakerCard}>
            <div className={styles.speakerHeader}>
              <div className={styles.avatar}>
                {speaker.photo ? (
                  <img src={speaker.photo || "/placeholder.svg"} alt={speaker.name} className={styles.avatarImage} />
                ) : (
                  <User size={24} className={styles.avatarIcon} />
                )}
              </div>
              <div className={styles.speakerInfo}>
                <h3 className={styles.speakerName}>{speaker.name}</h3>
                <p className={styles.speakerRole}>{speaker.eventRole}</p>
              </div>
              <div className={styles.status}>
                {getStatusIcon(speaker.status)}
                <span className={styles.statusText}>{getStatusText(speaker.status)}</span>
              </div>
            </div>
            {speaker.bio && <p className={styles.speakerBio}>{speaker.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
