"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import type { AvatarFile } from "@/entities/user/model/types"
import styles from "./AvatarSelector.module.css"
import { AvatarUploadModal } from "./AvatarUploadModal"

interface AvatarSelectorProps {
  currentAvatar: string
  defaultAvatarPath: string
  uploadedAvatarFile: File | null
  onAvatarChange: (defaultAvatarPath: string) => void
  onUploadedFileChange: (file: File | null) => void
  onResetDefaultAvatar?: () => void // Новый проп для сброса defaultAvatarPath
  userId?: string
  avatarId?: AvatarFile
  avatarUrl?: string
}

type AvatarSource = "default" | "uploaded" | "saved"

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  defaultAvatarPath,
  uploadedAvatarFile,
  onAvatarChange,
  onUploadedFileChange,
  onResetDefaultAvatar,
  userId,
  avatarId,
  avatarUrl,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatarPath)
  const [displayAvatar, setDisplayAvatar] = useState<string>("")
  const [avatarSource, setAvatarSource] = useState<AvatarSource>("saved")
  const { getAvatarUrl } = useAvatarCache()

  // Для отслеживания созданных URL для cleanup
  const uploadedFileUrl = useRef<string | null>(null)

  const avatars = Array.from({ length: 22 }, (_, i) => `/Avatars/Avatar${i + 1}.webp`)

  // Определяем начальный источник аватара
  useEffect(() => {
    if (uploadedAvatarFile) {
      setAvatarSource("uploaded")
    } else {
      // По умолчанию всегда показываем сохраненный аватар
      // "default" устанавливается только при явном выборе пользователем
      setAvatarSource("saved")
    }
  }, [uploadedAvatarFile])

  // Мемоизированная функция для получения аватара с учетом источника
  const getDisplayAvatar = useCallback(() => {
    switch (avatarSource) {
      case "default":
        // Приоритет у случайного/выбранного аватара
        return defaultAvatarPath

      case "uploaded":
        // Приоритет у загруженного файла
        if (uploadedAvatarFile) {
          // Очищаем предыдущий URL если есть
          if (uploadedFileUrl.current) {
            URL.revokeObjectURL(uploadedFileUrl.current)
            uploadedFileUrl.current = null
          }
          // Создаем новый URL для загруженного файла
          uploadedFileUrl.current = URL.createObjectURL(uploadedAvatarFile)
          return uploadedFileUrl.current
        }
        // Fallback если файл пропал
        return defaultAvatarPath

      case "saved":
      default:
        // Приоритет у сохраненного аватара
        const avatarIdString =
          typeof avatarId === "object" && avatarId?._id
            ? avatarId._id
            : typeof avatarId === "string"
              ? avatarId
              : undefined

        return getAvatarUrl(avatarUrl || currentAvatar, avatarIdString, userId, defaultAvatarPath)
    }
  }, [avatarSource, uploadedAvatarFile, defaultAvatarPath, avatarUrl, currentAvatar, avatarId, userId, getAvatarUrl])

  // Обновляем displayAvatar только при изменении зависимостей
  useEffect(() => {
    const newDisplayAvatar = getDisplayAvatar()
    setDisplayAvatar(newDisplayAvatar)
  }, [getDisplayAvatar])

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (uploadedFileUrl.current) {
        URL.revokeObjectURL(uploadedFileUrl.current)
        uploadedFileUrl.current = null
      }
    }
  }, [])

  const handleSave = () => {
    onAvatarChange(selectedAvatar)
    setShowModal(false)
  }

  const handleCancel = () => {
    setSelectedAvatar(defaultAvatarPath)
    setShowModal(false)
  }

  const handleRandomAvatar = () => {
    const availableAvatars = avatars.filter((avatar) => avatar !== defaultAvatarPath)
    const avatarsToChooseFrom = availableAvatars.length > 0 ? availableAvatars : avatars
    const randomIndex = Math.floor(Math.random() * avatarsToChooseFrom.length)
    const randomAvatar = avatarsToChooseFrom[randomIndex]

    // Очищаем загруженный файл
    onUploadedFileChange(null)

    // Обновляем defaultAvatarPath
    onAvatarChange(randomAvatar)

    // Устанавливаем источник как 'default' для приоритета
    setAvatarSource("default")
  }

  const handleUploadSuccess = (file: File) => {
    onUploadedFileChange(file)

    // Сбрасываем defaultAvatarPath к исходному значению при загрузке файла
    if (onResetDefaultAvatar) {
      onResetDefaultAvatar()
    }

    // Устанавливаем источник как 'uploaded' для приоритета
    setAvatarSource("uploaded")
  }

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error)
  }

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Аватар</h3>
        <div className={styles.currentAvatar} onClick={() => setShowModal(true)}>
          <Image
            src={displayAvatar || "/placeholder.webp"}
            alt="Текущий аватар"
            width={120}
            height={120}
            className={styles.avatarImage}
          />
          {/* <div className={styles.overlay}>
            <span>Изменить</span>
          </div> */}
        </div>

        <button className={styles.addButton} onClick={handleRandomAvatar} type="button">
          Случайная аватарка
        </button>

        <button className={styles.addButton} onClick={() => setShowUploadModal(true)} type="button">
          Загрузить с компьютера
        </button>
      </div>

      <AvatarUploadModal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
    </>
  )
}
