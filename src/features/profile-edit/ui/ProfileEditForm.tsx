"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { AuthorProfile } from "@/entities/user/model/types"
import { PersonalInfoBlock } from "./blocks/PersonalInfoBlock"
import { AboutBlock } from "./blocks/AboutBlock"
import { ProfessionalBlock } from "./blocks/ProfessionalBlock"
import { ContactsBlock } from "./blocks/ContactsBlock"
import { EducationBlock } from "./blocks/EducationBlock"
import { AvatarSelector } from "./components/AvatarSelector"
import { UnsavedChangesWarning } from "./components/UnsavedChangesWarning"
import { useUpdateMyProfileMutation } from "../api/profileEditApi"
import { useFormChanges } from "@/features/profile-edit/hooks/useFormChanges"
import { Alert } from "react-bootstrap"
import styles from "./ProfileEditForm.module.css"

interface ProfileEditFormProps {
  profile: AuthorProfile
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile }) => {
  const router = useRouter()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  const { formData, updateField, getDataToSend, hasChanges, resetToOriginal, updateOriginalData } =
    useFormChanges(profile)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    updateOriginalData(profile)
  }, [profile, updateOriginalData])

  const handleSave = async () => {
    try {
      setSaveStatus("idle")
      setErrorMessage("")

      // Получаем только измененные поля
      const dataToSend = getDataToSend()

      console.log("Отправляем только измененные поля:", dataToSend)

      // Если нет изменений, не отправляем запрос
      if (Object.keys(dataToSend).length === 0) {
        console.log("Нет изменений для отправки")
        return
      }

      // Отправка на сервер
      const result = await updateProfile(dataToSend).unwrap()

      setSaveStatus("success")

      // Перенаправление через 2 секунды
      setTimeout(() => {
        router.push(`/profile/${profile._id}`)
      }, 2000)
    } catch (error: any) {
      console.error("Update profile error:", error)
      setSaveStatus("error")
      setErrorMessage(error?.data?.error || error?.data?.message || "Произошла ошибка при сохранении")
    }
  }

  // Сброс формы
  const handleReset = () => {
    resetToOriginal()
    setSaveStatus("idle")
    setErrorMessage("")
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("У вас есть несохраненные изменения. Вы уверены, что хотите выйти?")) {
        router.push(`/profile/${profile._id}`)
      }
    } else {
      router.push(`/profile/${profile._id}`)
    }
  }
  return (
    <>
      <UnsavedChangesWarning hasUnsavedChanges={hasChanges} />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Редактирование профиля</h1>
        </div>

        {saveStatus === "success" && (
          <Alert variant="success" className={styles.alert}>
            Профиль успешно обновлен!
          </Alert>
        )}

        {saveStatus === "error" && (
          <Alert variant="danger" className={styles.alert}>
            {errorMessage}
          </Alert>
        )}

        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <AvatarSelector
              currentAvatar={formData.avatar || "/Avatars/Avatar1.jpg"}
              onAvatarChange={(avatar) => updateField("avatar", avatar)}
            />
          </div>

          <div className={styles.rightColumn}>
            <PersonalInfoBlock
              data={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthday: formData.birthday,
              }}
              onChange={updateField}
            />

            <AboutBlock bio={formData.bio || ""} onChange={updateField} />

            <ProfessionalBlock
              data={{
                placeWork: formData.placeWork,
                location: formData.location || "",
                experience: formData.experience || "",
                specialization: formData.specialization || "",
              }}
              onChange={updateField}
            />

            <ContactsBlock contacts={formData.contacts || []} onChange={updateField} />

            <EducationBlock education={formData.education || []} onChange={updateField} />
          
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.cancelButton} onClick={handleCancel} disabled={isUpdating}>
              Отмена
            </button>
            <button className={styles.secondaryButton} onClick={handleReset} disabled={!hasChanges || isUpdating}>
              Сбросить
            </button>
            <button className={styles.primaryButton} onClick={handleSave} disabled={!hasChanges || isUpdating}>
              {isUpdating ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
