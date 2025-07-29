"use client"

import type React from "react"
import { Modal } from "react-bootstrap"
import { X } from "lucide-react"
import { FileUpload } from "./FileUpload"
import styles from "./DocumentUploadModal.module.css"

interface DocumentUploadModalProps {
  show: boolean
  onHide: () => void
  onUploadSuccess: (file: File) => void
  onUploadError: (error: string) => void
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  show,
  onHide,
  onUploadSuccess,
  onUploadError,
}) => {
  const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg"]
  const maxFileSize = 10 * 1024 * 1024 

  const handleUploadSuccess = (file: File) => {
    onUploadSuccess(file)
  }

  return (
    <Modal show={show} onHide={onHide} centered className={styles.customModal} backdrop="static">
      

      <Modal.Body>
        <div className="text-center">
          {/* <h2 className={styles.modalTitle}>Загрузка документа</h2> */}
          <p className={styles.modalSubtitle}>Загрузите документ для подтверждения квалификации</p>
        </div>
        <button type="button" className={styles.closeButton} onClick={onHide} aria-label="Закрыть">
          <X size={20} />
        </button>

        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={onUploadError}
          onClose={onHide}
          acceptedFileTypes={acceptedFileTypes}
          maxFileSize={maxFileSize}
        />
      </Modal.Body>
    </Modal>
  )
}
