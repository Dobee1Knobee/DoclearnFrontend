"use client"

import type React from "react"
import { CalendarDays, Download, Eye, EyeOff, FileText, ShieldCheck, Trash2 } from "lucide-react"
import type { Document, DocumentCategory } from "@/entities/user/model/types"
import { VerifiedBadge } from "@/shared/ui/VerifiedBadge/VerifiedBadge"
import styles from "./DocumentCard.module.css"

interface DocumentCardProps {
  document: Document
  onDownload: (document: Document) => void
  onDelete: (document: Document) => void
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
  const formatDate = (value: string) => {
    const date = new Date(value)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const documentTitle = document.label || categoryLabels[document.category]

  return (
    <article className={styles.card}>
      <div className={styles.topline}>
        <span className={styles.categoryPill}>{categoryLabels[document.category]}</span>
        {document.isVerified && (
          <span className={styles.verifiedPill}>
            <ShieldCheck size={14} />
            Проверен
          </span>
        )}
      </div>

      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <FileText size={24} />
        </div>
        <div className={styles.info}>
          <h4 className={styles.title}>{documentTitle}</h4>
          <p className={styles.subtitle}>{categoryLabels[document.category]}</p>
        </div>
      </div>

      <div className={styles.metaRow}>
        <span className={styles.metaItem}><CalendarDays size={14} /> {formatDate(document.uploadedAt)}</span>
        {showVisibility && (
          <span className={`${styles.visibilityPill} ${document.isPublic ? styles.public : styles.private}`}>
            {document.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
            {document.isPublic ? "Публичный" : "Приватный"}
          </span>
        )}
        {document.isVerified && (
          <span className={styles.badgeWithIcon}>
            <VerifiedBadge className={styles.verifiedIcon} />
            Верифицирован
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={`${styles.actionButton} ${styles.download}`} onClick={() => onDownload(document)}>
          <Download size={16} />
          Скачать
        </button>
        {showActions && (
          <button type="button" className={`${styles.actionButton} ${styles.delete}`} onClick={() => onDelete(document)}>
            <Trash2 size={16} />
            Удалить
          </button>
        )}
      </div>
    </article>
  )
}
