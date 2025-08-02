"use client"

import type React from "react"
import { Download, Trash2, FileText, Calendar, Eye, EyeOff } from "lucide-react"
import type { Document, DocumentCategory } from "@/entities/user/model/types"
import styles from "./DocumentCard.module.css"

interface DocumentCardProps {
  document: Document
  onDownload: (documentId: string) => void
  onDelete: (documentId: string) => void
  showActions?: boolean
  showVisibility?: boolean
}

const categoryLabels: Record<DocumentCategory, string> = {
  diploma: "Диплом",
  certificate: "Сертификат",
  license: "Лицензия",
  id: "Удостоверение",
  other: "Другое",
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ 
    document, 
    onDownload, 
    onDelete, 
    showActions = true, 
    showVisibility = true, 
  }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleDownload = () => {
    onDownload(document._id)
  }

  const handleDelete = () => {
    onDelete(document._id)
  }

  return (
    <div className={styles.documentCard}>
      <div className={`${styles.categoryBadge} ${styles[document.category]}`}>{categoryLabels[document.category]}</div>

      <div className={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div className={styles.documentIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.documentInfo}>
            <h4 className={styles.documentTitle}>{document.label || categoryLabels[document.category]}</h4>
            <p className={styles.documentCategory}>{categoryLabels[document.category]}</p>
          </div>
        </div>
      </div>
      {showVisibility && (
        <div className={styles.documentMeta}>
          <div className={styles.uploadDate}>
            <Calendar size={12} />
            {formatDate(document.uploadedAt)}
          </div>
          <div className={`${styles.publicBadge} ${document.isPublic ? styles.public : styles.private}`}>
            {document.isPublic ? <Eye size={12} /> : <EyeOff size={12} />}
            {document.isPublic ? "Публичный" : "Приватный"}
          </div>
        </div>
      )}

      <div className={styles.cardActions}>
        <button type="button" className={`${styles.actionButton} ${styles.download}`} onClick={handleDownload}>
          <Download size={16} />
          Скачать
        </button>
        {showActions && (
          <button type="button" className={`${styles.actionButton} ${styles.delete}`} onClick={handleDelete}>
            <Trash2 size={16} />
            Удалить
          </button>
        )}
      </div>
    </div>
  )
}
