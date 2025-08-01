"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import { UploadCloud, FileIcon, X, CircleCheck } from "lucide-react"
import styles from "./FileUpload.module.css"

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface FileUploadProps {
  onUploadSuccess?: (file: File) => void
  onUploadError?: (error: string) => void
  onClose?: () => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
  onSubmit?: () => void
  uploadStatus?: UploadStatus
  selectedFile?: File | null
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  onClose,
  acceptedFileTypes = [],
  maxFileSize = 5 * 1024 * 1024,
  onSubmit,
  uploadStatus = "idle",
  selectedFile: externalSelectedFile,
}) => {
  const [internalFile, setInternalFile] = useState<File | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const file = externalSelectedFile || internalFile
  const currentStatus = uploadStatus !== "idle" ? uploadStatus : status

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
      const err = `Недопустимый тип файла. Разрешены: ${acceptedFileTypes
        .map((t) => t.split("/")[1])
        .join(", ")
        .toUpperCase()}`
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

  const simulateProgress = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        clearInterval(interval)
        setProgress(100)
      } else {
        setProgress(currentProgress)
      }
    }, 200)
  }

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (!handleFileValidation(selectedFile)) {
      setInternalFile(null)
      return
    }

    setInternalFile(selectedFile)
    setError(null)
    setStatus("idle")
    setProgress(0)
    onUploadSuccess?.(selectedFile)
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (currentStatus !== "uploading" && currentStatus !== "success") {
        setIsDragging(true)
      }
    },
    [currentStatus],
  )

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (currentStatus === "uploading" || currentStatus === "success") return

      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [currentStatus],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    handleFileSelect(selectedFile || null)
    if (e.target) e.target.value = ""
  }

  const triggerFileInput = () => {
    if (currentStatus === "uploading") return
    fileInputRef.current?.click()
  }

  const resetState = () => {
    setInternalFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    setTimeout(() => {
      triggerFileInput()
    }, 100)
  }

  // const handleUploadNewFile = () => {
  //   resetState()
  //   triggerFileInput()
  // }

  // const handleCloseModal = () => {
  //   resetState()
  //   onClose?.()
  // }

  const getFileTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      "application/pdf": "PDF",
      "image/png": "PNG",
      "image/jpeg": "JPEG",
      "image/jpg": "JPG",
    }
    return typeMap[type] || type.split("/")[1]?.toUpperCase() || "Unknown"
  }

  React.useEffect(() => {
    if (uploadStatus === "uploading") {
      simulateProgress()
    }
  }, [uploadStatus])

  if (file && currentStatus === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CircleCheck size={48} />
          </div>
          <h3 className={styles.successTitle}>Файл успешно загружен!</h3>

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
                <span className={styles.fileType}>{getFileTypeDisplay(file.type)}</span>
              </div>
            </div>
          </div>

          {/* <div className={styles.actionButtons}>
            <button onClick={handleUploadNewFile} type="button" className={styles.uploadNewButton}>
              Загрузить новый файл
            </button>
            <button onClick={handleCloseModal} type="button" className={styles.goBackButton}>
              Закрыть
            </button>
          </div> */}
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

  if (currentStatus === "uploading" && file) {
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

          <h3 className={styles.uploadingTitle}>Загрузка файла...</h3>
          <p className={styles.uploadingFileName} title={file.name}>
            {file.name}
          </p>
          <p className={styles.uploadingProgress}>{Math.round(progress)}%</p>
        </div>
      </div>
    )
  }

  const handleTryAgain = () => {
    resetState()
    if (externalSelectedFile) {
      onUploadSuccess?.(null as any)
    }
  }

  if (currentStatus === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <X className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>Ошибка загрузки</h3>
          <p className={styles.errorText}>{error || "Произошла неизвестная ошибка"}</p>
          <button onClick={handleTryAgain} type="button" className={styles.tryAgainButton}>
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (file && currentStatus === "idle") {
    return (
      <div className={styles.container}>
        <div className={styles.selectedFileContainer}>
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
                <span className={styles.fileType}>{getFileTypeDisplay(file.type)}</span>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button onClick={onSubmit} type="button" className={styles.uploadButton}>
              Загрузить документ
            </button>
            <button onClick={resetState} type="button" className={styles.changeFileButton}>
              Выбрать другой файл
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

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
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
        aria-label="Область для загрузки файлов"
      >
        <UploadCloud className={styles.uploadIcon} />
        <h3 className={styles.uploadTitle}>
          <span className={styles.uploadLink}>Нажмите для загрузки</span> или перетащите файл
        </h3>
        <p className={styles.uploadHint}>
          {acceptedFileTypes.length > 0
            ? `Разрешены: ${acceptedFileTypes
                .map((t) => t.split("/")[1])
                .join(", ")
                .toUpperCase()}`
            : "PDF, PNG, JPEG"}{" "}
          (Макс. {formatBytes(maxFileSize)})
        </p>
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