"use client"

import type React from "react"
import { Download, Trash2, FileText, Calendar, Eye, EyeOff, CheckCircle } from "lucide-react"
import type { Document, DocumentCategory } from "@/entities/user/model/types"
import styles from "./DocumentCard.module.css"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"

interface DocumentCardProps {
  document: Document
  onDownload: (documentId: string) => void
  onDelete: (documentId: string) => void
  showActions?: boolean
  showVisibility?: boolean
}

const categoryLabels: Record<DocumentCategory, string> = {
  higher_education_diploma: "Диплом о высшем образовании",
  residency_diploma: "Диплом об окончании ординатуры",
  professional_retraining_diploma: "Диплом о проф. переподготовке",
  academic_degree_diploma: "Диплом кандидата/доктора наук",
  accreditation_certificate: "Свидетельство об аккредитации",
  specialist_certificate: "Сертификат специалиста",
  qualification_certificate: "Удостоверение о повышении квалификации",
  medical_license: "Лицензия на мед. деятельность",
  scientific_publication: "Научная публикация / Статья",
  patent: "Патент на изобретение",
  award: "Награда / Грамота",
  recommendation_letter: "Рекомендательное письмо",
  student_id: "Студенческий билет",
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
      {/* <div className={`${styles.categoryBadge} ${styles[document.category]}`}>{categoryLabels[document.category]}</div> */}

      <div className={styles.cardHeader}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div className={styles.documentIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.documentInfo}>
            {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h4 className={styles.documentTitle}>{document.label || categoryLabels[document.category]}</h4>
              {document.isVerified && <CheckCircle size={16} className={styles.verifiedIcon} />}
            </div> */}
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
          {document.isVerified &&
            <div className={styles.tooltipWrapper} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <VerifiedBadge className={styles.verifiedIcon} />
              <span className={styles.tooltipText}>Верифицирован</span>
            </div>
          }
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
