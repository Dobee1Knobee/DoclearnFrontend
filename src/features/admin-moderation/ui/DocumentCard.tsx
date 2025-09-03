"use client"
import { Eye, Check, X } from "lucide-react"
import { useApproveDocumentMutation, useRejectDocumentMutation } from "../api/adminModerationApi"
import styles from "./AdminModeration.module.css"
import type { DocumentCategory } from "../model/types"

interface DocumentCardProps {
  item: {
    userId: string
    userName: string
    document: {
      _id: string
      category: string
      file: {
        originalName: string
        size: number
      }
      label?: string
    }
    documentUrl: string
  }
  onView: (userId: string, type: string, documentUrl?: string) => void
  categoryLabels: Record<DocumentCategory, string>
  formatFileSize: (bytes: number) => string
}

export function DocumentCard({ item, onView, categoryLabels, formatFileSize }: DocumentCardProps) {
  const [approveDocument, { isLoading: isApprovingDoc }] = useApproveDocumentMutation()
  const [rejectDocument, { isLoading: isRejectingDoc }] = useRejectDocumentMutation()

  const handleApprove = async () => {
    try {
      await approveDocument({ userId: item.userId, documentId: item.document._id }).unwrap()
    } catch (error) {
      console.error("Ошибка при одобрении документа:", error)
    }
  }

  const handleReject = async () => {
    try {
      await rejectDocument({ userId: item.userId, documentId: item.document._id }).unwrap()
    } catch (error) {
      console.error("Ошибка при отклонении документа:", error)
    }
  }

  return (
    <div className={styles.queueItem}>
      <div className={styles.itemHeader}>
        <div className={styles.itemInfo}>
          <h3 className={styles.itemTitle}>
            {categoryLabels[item.document.category as DocumentCategory]} - {item.userName}
          </h3>
          <div className={styles.itemMeta}>
            <div className={styles.itemUser}>
              <span>{item.userId}</span>
            </div>
          </div>
        </div>
        <div className={styles.itemActions}>
          <button
            onClick={() => onView(item.userId, "document", item.documentUrl)}
            className={`${styles.actionButton} ${styles.viewButton}`}
          >
            <Eye size={16} />
            Просмотреть
          </button>
          <button
            onClick={handleApprove}
            disabled={isApprovingDoc || isRejectingDoc}
            className={`${styles.actionButton} ${styles.approveButton}`}
          >
            <Check size={16} />
            {isApprovingDoc ? "Одобряем..." : "Одобрить"}
          </button>
          <button
            onClick={handleReject}
            disabled={isApprovingDoc || isRejectingDoc}
            className={`${styles.actionButton} ${styles.rejectButton}`}
          >
            <X size={16} />
            {isRejectingDoc ? "Отклоняем..." : "Отклонить"}
          </button>
        </div>
      </div>
      <div className={styles.itemContent}>
        <div className={styles.contentTitle}>Информация о документе:</div>
        <div className={styles.contentText}>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Файл:</strong> {item.document.file.originalName} ({formatFileSize(item.document.file.size)})
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Категория:</strong> {categoryLabels[item.document.category as DocumentCategory]}
          </div>
          {item.document.label && (
            <div style={{ marginBottom: "0.25rem" }}>
              <strong>Название:</strong> {item.document.label}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
