"use client"
import { Clock, Eye, Check, X } from "lucide-react"
import { useState } from "react"
import { useApproveSpecificFieldsMutation, useRejectChangesMutation } from "../api/adminModerationApi"
import { ActionModal } from "@/shared/ui/ActionModal/ActionModal"
import styles from "./AdminModeration.module.css"
import type { PendingUser } from "../model/types"

interface ProfileCardProps {
  user: PendingUser
  onView: (userId: string, type: string) => void
  formatDate: (dateString: string) => string
  getFieldLabel: (field: string) => string
}

export function ProfileCard({ user, onView, formatDate, getFieldLabel }: ProfileCardProps) {
  const [approveChanges, { isLoading: isApproving }] = useApproveSpecificFieldsMutation()
  const [rejectChanges, { isLoading: isRejecting }] = useRejectChangesMutation()
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  const handleApprove = async () => {
    try {
      await approveChanges({
        userId: user._id,
        fields: { fieldsToApprove: Object.keys(user.pendingChanges.data) as string[] },
      }).unwrap()
    } catch (error) {
      console.error("Ошибка при одобрении изменений:", error)
    }
  }

  const handleReject = () => {
    setIsRejectModalOpen(true)
  }

  const handleRejectConfirm = async (comment: string) => {
    try {
      await rejectChanges({ userId: user._id, comment }).unwrap()
      setIsRejectModalOpen(false)
    } catch (error) {
      console.error("Ошибка при отклонении изменений:", error)
    }
  }

  const changedFields = Object.keys(user.pendingChanges.data)
  const changes = Object.entries(user.pendingChanges.data).reduce(
    (acc, [key, value]) => {
      acc[key] = value.value
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <>
      <div className={styles.queueItem}>
        <div className={styles.itemHeader}>
          <div className={styles.itemInfo}>
            <h3 className={styles.itemTitle}>
              Изменения профиля - {user.firstName} {user.lastName}
            </h3>
            <div className={styles.itemMeta}>
              <div className={styles.itemUser}>
                <span>{user.email}</span>
              </div>
              <div className={styles.itemDate}>
                <Clock size={14} />
                <span>{formatDate(user.pendingChanges.submittedAt)}</span>
              </div>
            </div>
          </div>
          <div className={styles.itemActions}>
            <button
              onClick={() => onView(user._id, "profile")}
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
          <div className={styles.contentTitle}>Измененные поля:</div>
          <div className={styles.fieldsList}>
            {changedFields.map((field) => (
              <span key={field} className={styles.fieldBadge}>
                {getFieldLabel(field)}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <div className={styles.contentText}>
              {Object.entries(changes).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.25rem" }}>
                  <strong>{getFieldLabel(key)}:</strong> {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ActionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        userName={`${user.firstName} ${user.lastName}`}
        isLoading={isRejecting}
        type="reject"
      />
    </>
  )
}
