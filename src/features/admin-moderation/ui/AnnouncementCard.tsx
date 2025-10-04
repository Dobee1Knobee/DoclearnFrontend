"use client"

import { useState } from "react"
import { Eye, Check, X, User, Tag } from "lucide-react"
import type { PendingAnnouncement } from "../model/types"
import styles from "./AdminModeration.module.css"

interface AnnouncementCardProps {
  announcement: PendingAnnouncement
  onView: (announcementId: string, type: string) => void
  formatDate: (dateString: string) => string
}

export function AnnouncementCard({
  announcement,
  onView,
  formatDate,
}: AnnouncementCardProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)
    setTimeout(() => setIsApproving(false), 1000)
  }

  const handleReject = async () => {
    setIsRejecting(true)
    setTimeout(() => setIsRejecting(false), 1000)
  }

  return (
    <div className={styles.queueItem}>
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <h3 className={styles.itemTitle}>{announcement.title}</h3>
          <div className={styles.itemMeta}>
            <div className={styles.itemUser}>
              <Tag size={14} />
              <span>{announcement.type}</span>
            </div>
            <div className={styles.itemUser}>
              <User size={14} />
              <span>Организатор: {announcement.organizer[0] || "Не указан"}</span>
            </div>
          </div>
        </div>
        <div className={styles.itemActions}>
          <button
            onClick={() => onView(announcement._id, "announcement")}
            className={`${styles.actionButton} ${styles.viewButton}`}
          >
            <Eye size={16} />
            Просмотреть
          </button>
          <button
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            className={`${styles.actionButton} ${styles.approveButton}`}
          >
            <Check size={16} />
            {isApproving ? "Одобряем..." : "Одобрить"}
          </button>
          <button
            onClick={handleReject}
            disabled={isApproving || isRejecting}
            className={`${styles.actionButton} ${styles.rejectButton}`}
          >
            <X size={16} />
            {isRejecting ? "Отклоняем..." : "Отклонить"}
          </button>
        </div>
      </div>

      <div className={styles.itemContent}>
        <div className={styles.contentTitle}>Информация об объявлении:</div>
        <div className={styles.contentText}>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>ID:</strong> {announcement._id}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Тип:</strong> {announcement.type}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Статус:</strong> {announcement.status}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Формат:</strong> {announcement.format}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Цена:</strong>{" "}
            {announcement.price_type === "free" ? "Бесплатно" : `${announcement.price} ${announcement.currency}`}
          </div>
          {announcement.activeFrom && (
            <div style={{ marginBottom: "0.25rem" }}>
              <strong>Дата начала:</strong> {formatDate(announcement.activeFrom)}
            </div>
          )}
          {announcement.activeTo && (
            <div style={{ marginBottom: "0.25rem" }}>
              <strong>Дата окончания:</strong> {formatDate(announcement.activeTo)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
