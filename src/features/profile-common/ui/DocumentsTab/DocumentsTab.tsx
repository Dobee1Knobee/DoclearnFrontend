"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Eye, FileText, ShieldCheck, Upload } from "lucide-react"
import type { Document, SpecialistUser } from "@/entities/user/model/types"
import { selectUser } from "@/features/auth/model/selectors"
import { useAppSelector } from "@/shared/hooks/hooks"
import { DocumentCard } from "./DocumentCard"
import { DocumentUploadModal } from "./DocumentUploadModal"
import styles from "./DocumentsTab.module.css"

interface DocumentsTabProps {
  profile: SpecialistUser
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ profile }) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const currentUser = useAppSelector(selectUser)

  const isOwner = currentUser?._id === profile._id
  const documents = profile.documents || []

  const visibleDocuments = useMemo(
    () => (isOwner ? documents : documents.filter((item) => item.isPublic && item.isVerified)),
    [documents, isOwner],
  )

  const stats = {
    total: documents.length,
    verified: documents.filter((item) => item.isVerified).length,
    public: documents.filter((item) => item.isPublic).length,
  }

  const handleUploadSuccess = () => {
    setShowUploadModal(false)
  }

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error)
  }

  const handleDownloadDocument = (document: Document) => {
    if (typeof window === "undefined") return

    if (/^https?:\/\//.test(document.file) || document.file.startsWith("/")) {
      window.open(document.file, "_blank", "noopener,noreferrer")
      return
    }

    console.log("Download document:", document)
  }

  const handleDeleteDocument = (document: Document) => {
    console.log("Delete document:", document)
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>{isOwner ? "Мои материалы" : "Подтверждение квалификации"}</span>
          <h3 className={styles.title}>{isOwner ? "Документы профиля" : "Публичные документы"}</h3>
          <p className={styles.subtitle}>
            {isOwner
              ? "Сюда собраны дипломы, сертификаты и другие подтверждающие файлы. Раздел должен выглядеть как аккуратное портфолио специалиста."
              : "Показываются только открытые и верифицированные документы, которые можно использовать как подтверждение профиля."}
          </p>
        </div>

        {isOwner && (
          <button type="button" className={styles.uploadButton} onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            Загрузить документ
          </button>
        )}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><FileText size={18} /></span>
          <div>
            <strong className={styles.statValue}>{isOwner ? stats.total : visibleDocuments.length}</strong>
            <span className={styles.statLabel}>{isOwner ? 'всего документов' : 'доступно к просмотру'}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><ShieldCheck size={18} /></span>
          <div>
            <strong className={styles.statValue}>{stats.verified}</strong>
            <span className={styles.statLabel}>верифицировано</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}><Eye size={18} /></span>
          <div>
            <strong className={styles.statValue}>{stats.public}</strong>
            <span className={styles.statLabel}>публичных</span>
          </div>
        </div>
      </div>

      {visibleDocuments.length > 0 ? (
        <div className={styles.documentsGrid}>
          {visibleDocuments.map((document) => (
            <DocumentCard
              key={document._id}
              document={document}
              onDownload={handleDownloadDocument}
              onDelete={handleDeleteDocument}
              showActions={isOwner}
              showVisibility={isOwner}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>{isOwner ? <Upload size={34} /> : <FileText size={34} />}</div>
          <h4 className={styles.emptyTitle}>{isOwner ? 'Документы еще не добавлены' : 'Открытых документов пока нет'}</h4>
          <p className={styles.emptyText}>
            {isOwner
              ? 'Загрузите дипломы, сертификаты и другие подтверждения, чтобы профиль выглядел убедительно и завершенно.'
              : 'Пользователь еще не открыл документы для просмотра или они находятся на модерации.'}
          </p>
          {isOwner && (
            <button type="button" className={styles.emptyAction} onClick={() => setShowUploadModal(true)}>
              Добавить документ
            </button>
          )}
        </div>
      )}

      <DocumentUploadModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
    </div>
  )
}
