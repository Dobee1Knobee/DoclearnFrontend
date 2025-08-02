"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Alert } from "react-bootstrap"
import { X } from "lucide-react"
import { FileUpload } from "./FileUpload"
import type { DocumentCategory } from "@/entities/user/model/types"
import { useUploadDocumentMutation } from "@/features/profile-edit/api/profileEditApi"
import styles from "./DocumentUploadModal.module.css"

interface DocumentUploadModalProps {
  show: boolean
  onHide: () => void
  onUploadSuccess: () => void
  onUploadError: (error: string) => void
}

const categoryOptions: { value: DocumentCategory; label: string }[] = [
  { value: "diploma", label: "Диплом" },
  { value: "certificate", label: "Сертификат" },
  { value: "license", label: "Лицензия" },
  { value: "id", label: "Удостоверение" },
  { value: "other", label: "Другое" },
]

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  show,
  onHide,
  onUploadSuccess,
  onUploadError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState<DocumentCategory>("diploma")
  const [label, setLabel] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const [uploadDocument] = useUploadDocumentMutation()

  const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg"]
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const handleUploadSuccess = (file: File) => {
    setSelectedFile(file)
    setError(null)
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
    onUploadError(errorMessage)
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Пожалуйста, выберите файл")
      return
    }

    setUploadStatus("uploading")
    setError(null)

    try {
      await uploadDocument({
        document: selectedFile,
        category,
        label: label.trim() || undefined,
        isPublic,
      }).unwrap()

      setUploadStatus("success")

      setTimeout(() => {
        handleClose()
        onUploadSuccess()
      }, 1500)
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Произошла ошибка при загрузке документа"
      setError(errorMessage)
      setUploadStatus("error")
      onUploadError(errorMessage)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setCategory("diploma")
    setLabel("")
    setIsPublic(true)
    setUploadStatus("idle")
    setError(null)
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered className={styles.customModal} backdrop="static">
      <Modal.Body>
        <div className="text-center">
          <p className={styles.modalTitle}>Загрузка документа</p>
        </div>

        <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="Закрыть">
          <X size={20} />
        </button>

        {/* {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )} */}

        {uploadStatus !== "success" && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Категория документа</label>
              <select
                className={styles.customSelect}
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                required
                disabled={uploadStatus === "uploading"}
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Название документа (необязательно)</label>
              <input
                type="text"
                className={styles.customInput}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Например: Диплом о высшем образовании"
                maxLength={100}
                disabled={uploadStatus === "uploading"}
              />
              <div className={styles.checkboxDescription} style={{ marginTop: "-15px", marginBottom: "15px" }}>
                Если не указано, будет использовано название категории
              </div>
            </div>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="isPublic"
                className={styles.customCheckbox}
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={uploadStatus === "uploading"}
              />
              <div>
                <label htmlFor="isPublic" className={styles.checkboxLabel}>
                  Сделать документ публичным
                </label>
                <div className={styles.checkboxDescription}>
                  Публичные документы видны другим пользователям в вашем профиле
                </div>
              </div>
            </div>
          </>
        )}

        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onClose={handleClose}
          acceptedFileTypes={acceptedFileTypes}
          maxFileSize={maxFileSize}
          onSubmit={handleSubmit}
          uploadStatus={uploadStatus}
          selectedFile={selectedFile}
        />
      </Modal.Body>
    </Modal>
  )
}
