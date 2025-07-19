"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { UploadCloud, FileIcon, X, CircleCheck } from "lucide-react"
import Image from "next/image"
import styles from "./AvatarFileUpload.module.css"

type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error"

interface AvatarFileUploadProps {
  onUploadSuccess?: (file: File) => void
  onUploadError?: (error: string) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
}

export const AvatarFileUpload: React.FC<AvatarFileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = [],
  maxFileSize = 5 * 1024 * 1024,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (!bytes) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const handleFileValidation = (selectedFile: File): boolean => {
    setError(null)

    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(selectedFile.type)) {
      const err = `Недопустимый тип файла. Разрешены: PNG, JPEG`
      setError(err)
      setStatus("error")
      onUploadError?.(err)
      return false
    }

    if (selectedFile.size > maxFileSize) {
      const err = `Размер файла превышает лимит ${formatBytes(maxFileSize)}`
      setError(err)
      setStatus("error")
      onUploadError?.(err)
      return false
    }

    return true
  }

  const simulateUpload = (uploadingFile: File) => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        clearInterval(interval)
        setProgress(100)
        setStatus("success")
        onUploadSuccess?.(uploadingFile)
      } else {
        setProgress(currentProgress)
      }
    }, 200)
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (!handleFileValidation(selectedFile)) {
      setFile(null)
      setPreviewUrl(null)
      return
    }

    setFile(selectedFile)
    setError(null)

    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)

    setStatus("uploading")
    setProgress(0)
    simulateUpload(selectedFile)
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status !== "uploading" && status !== "success") {
        setStatus("dragging")
      }
    },
    [status],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status === "dragging") {
        setStatus("idle")
      }
    },
    [status],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (status === "uploading" || status === "success") return

      setStatus("idle")
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [status],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    handleFileSelect(selectedFile || null)
    if (e.target) e.target.value = ""
  }

  const triggerFileInput = () => {
    if (status === "uploading") return
    fileInputRef.current?.click()
  }

  const resetState = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleUploadNewFile = () => {
    resetState()
    triggerFileInput()
  }

  const handleGoBack = () => {
    resetState()
  }

  if (file && status === "success" && previewUrl) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CircleCheck size={48} />
          </div>
          <h3 className={styles.successTitle}>Файл готов к загрузке!</h3>

          <div className={styles.previewContainer}>
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Превью аватара"
              width={120}
              height={120}
              className={styles.previewImage}
            />
          </div>

          <div className={styles.fileInfo}>
            <div className={styles.fileIconWrapper}>
              <FileIcon size={24} />
            </div>
            <div className={styles.fileDetails}>
              <p className={styles.fileName} title={file.name}>
                {file.name}
              </p>
              <div className={styles.fileMetadata}>
                <span className={styles.fileSize}>{formatBytes(file.size)}</span>
                <span className={styles.fileDivider}>•</span>
                <span className={styles.fileType}>{file.type === "image/png" ? "PNG" : "JPEG"}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={handleUploadNewFile} type="button" className={styles.uploadNewButton}>
              Выбрать другой файл
            </button>
            <button onClick={handleGoBack} type="button" className={styles.goBackButton}>
              Отмена
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className={styles.hiddenInput}
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(",")}
        />
      </div>
    )
  }

  if (status === "uploading" && file) {
    return (
      <div className={styles.container}>
        <div className={styles.uploadingContainer}>
          <div className={styles.progressContainer}>
            <div className={styles.progressCircle}>
              <svg className={styles.progressSvg} viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className={styles.progressBackground} strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className={styles.progressBar}
                  strokeWidth="2.5"
                  strokeDasharray="100"
                  strokeDashoffset={100 - progress}
                />
              </svg>
              <FileIcon className={styles.progressIcon} />
            </div>
          </div>

          <h3 className={styles.uploadingTitle}>Подготовка файла...</h3>
          <p className={styles.uploadingFileName} title={file.name}>
            {file.name}
          </p>
          <p className={styles.uploadingProgress}>{Math.round(progress)}%</p>

          <button onClick={resetState} type="button" className={styles.cancelButton}>
            Отменить
          </button>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <X className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>Ошибка выбора файла</h3>
          <p className={styles.errorText}>{error || "Произошла неизвестная ошибка"}</p>
          <button onClick={resetState} type="button" className={styles.tryAgainButton}>
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${status === "dragging" ? styles.dragging : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            triggerFileInput()
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Область для загрузки аватара"
      >
        <UploadCloud className={styles.uploadIcon} />
        <h3 className={styles.uploadTitle}>
          <span className={styles.uploadLink}>Нажмите для выбора</span> или перетащите изображение
        </h3>
        <p className={styles.uploadHint}>PNG, JPEG (Макс. {formatBytes(maxFileSize)})</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className={styles.hiddenInput}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes.join(",")}
      />
    </div>
  )
}
