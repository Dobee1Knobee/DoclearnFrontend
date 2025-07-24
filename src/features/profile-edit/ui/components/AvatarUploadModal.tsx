"use client"

import type React from "react"
import { Modal } from "react-bootstrap"
import { X } from "lucide-react"
import { AvatarFileUpload } from "./AvatarFileUpload"
import styles from "./AvatarUploadModal.module.css"

interface AvatarUploadModalProps {
  show: boolean
  onHide: () => void
  onUploadSuccess: (file: File) => void
  onUploadError: (error: string) => void
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  show,
  onHide,
  onUploadSuccess,
  onUploadError,
}) => {
  const acceptedFileTypes = ["image/png", "image/jpeg"]
  const maxFileSize = 5 * 1024 * 1024 // 5MB

  const handleUploadSuccess = (file: File) => {
    onUploadSuccess(file)
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <button type="button" className={styles.closeButton} onClick={onHide} aria-label="Закрыть">
        <X size={20} />
      </button>

      <Modal.Body>
        <div className="text-center">
          <h2 className={styles.modalTitle}>Загрузка аватара</h2>
          <p className={styles.modalSubtitle}>Выберите изображение для вашего аватара</p>
        </div>

        <AvatarFileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={onUploadError}
          acceptedFileTypes={acceptedFileTypes}
          maxFileSize={maxFileSize}
        />
      </Modal.Body>
    </Modal>
  )
}
