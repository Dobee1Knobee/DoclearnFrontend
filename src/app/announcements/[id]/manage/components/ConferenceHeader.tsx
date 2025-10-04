"use client"

import type { ConferenceWithManagement } from "@/entities/announcement/model/conference-management"
import styles from "./ConferenceHeader.module.css"

interface ConferenceHeaderProps {
  conference: ConferenceWithManagement
}

export default function ConferenceHeader({ conference }: ConferenceHeaderProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleEdit = () => {
    window.location.href = `/announcements/${conference.id}/edit`
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{conference.title}</h1>
          <button className={styles.editButton} onClick={handleEdit}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.99967 14.3334L2.99967 11L11.333 2.00004Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Редактировать
          </button>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Организатор</div>
            <div className={styles.infoValue}>{conference.organizerName}</div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Даты проведения</div>
            <div className={styles.infoValue}>
              {formatDate(conference.activeFrom)}
              {conference.activeTo && ` — ${formatDate(conference.activeTo)}`}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Формат</div>
            <div className={styles.infoValue}>
              {conference.format === "online" && "Онлайн"}
              {conference.format === "offline" && "Офлайн"}
              {conference.format === "hybrid" && "Гибридный"}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Участники</div>
            <div className={styles.infoValue}>
              {conference.currentParticipants}
              {conference.maxParticipants && ` / ${conference.maxParticipants}`}
            </div>
          </div>

          {conference.location && (
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Место проведения</div>
              <div className={styles.infoValue}>
                {conference.location.city}
                {conference.location.address && `, ${conference.location.address}`}
              </div>
            </div>
          )}

          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Статус</div>
            <div className={styles.statusBadge}>{conference.status}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
