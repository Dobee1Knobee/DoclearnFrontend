"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "react-bootstrap"
import { Upload, FileText } from "lucide-react"
import type { AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectUser } from "@/features/auth/model/selectors"
import { DocumentUploadModal } from "./DocumentUploadModal"
import styles from "./DocumentsTab.module.css"

interface DocumentsTabProps {
  profile: AuthorProfile | StudentProfile
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ profile }) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const currentUser = useAppSelector(selectUser)

  const isOwner = currentUser?._id === profile._id

  const handleUploadSuccess = () => {}

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error)
  }

  if (isOwner) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Мои документы</h3>
          <Button variant="primary" onClick={() => setShowUploadModal(true)} className={styles.uploadButton}>
            <Upload size={16} className={styles.uploadIcon} />
            Загрузить документ
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.empty}>
            <Upload size={48} className={styles.emptyIcon} />
            <h4 className={styles.emptyTitle}>Документы не загружены</h4>
            <p className={styles.emptyText}>Загрузите документы для подтверждения квалификации</p>
          </div>
        </div>

        <DocumentUploadModal
          show={showUploadModal}
          onHide={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.empty}>
          <FileText size={48} className={styles.emptyIcon} />
          <h4 className={styles.emptyTitle}>Документов нет</h4>
          <p className={styles.emptyText}>Пользователь не загрузил документы или они находятся на модерации</p>
        </div>
      </div>
    </div>
  )
}
