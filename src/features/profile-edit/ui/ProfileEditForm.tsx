"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { AuthorProfile, StudentProfile } from "@/entities/user/model/types"
import { PersonalInfoBlock } from "./blocks/PersonalInfoBlock"
import { AboutBlock } from "./blocks/AboutBlock"
import { ProfessionalBlock } from "./blocks/ProfessionalBlock"
import { StudentInfoBlock } from "./blocks/StudentInfoBlock"
import { ContactsBlock } from "./blocks/ContactsBlock"
import { EducationBlock } from "./blocks/EducationBlock"
import { AvatarSelector } from "./components/AvatarSelector"
import { UnsavedChangesWarning } from "./components/UnsavedChangesWarning"
import { useUpdateMyProfileMutation } from "../api/profileEditApi"
import { useFormChanges } from "@/features/profile-edit/hooks/useFormChanges"
import { Alert } from "react-bootstrap"
import styles from "./ProfileEditForm.module.css"

interface ProfileEditFormProps {
  profile: AuthorProfile | StudentProfile
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile }) => {
  const router = useRouter()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  const { formData, updateField, getDataToSend, hasChanges, resetToOriginal, updateOriginalData } =
    useFormChanges(profile)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [hasValidationErrors, setHasValidationErrors] = useState(false)
  const [educationErrors, setEducationErrors] = useState(false)
  const [contactsErrors, setContactsErrors] = useState(false)

  useEffect(() => {
    updateOriginalData(profile)
  }, [profile, updateOriginalData])

  const handleEducationValidationChange = (hasErrors: boolean) => {
    setEducationErrors(hasErrors)
    setHasValidationErrors(hasErrors || contactsErrors)
  }

  const handleContactsValidationChange = (hasErrors: boolean) => {
    setContactsErrors(hasErrors)
    setHasValidationErrors(educationErrors || hasErrors)
  }

  const handleValidationChange = (hasErrors: boolean) => {
    setHasValidationErrors(hasErrors)
  }

  const handleSave = async () => {
    try {
      setSaveStatus("idle")
      setErrorMessage("")

      const dataToSend = getDataToSend()

      console.log("Отправляем только измененные поля:", dataToSend)

      if (Object.keys(dataToSend).length === 0) {
        console.log("Нет изменений для отправки")
        return
      }

      const result = await updateProfile(dataToSend).unwrap()

      setSaveStatus("success")

      setTimeout(() => {
        router.push(`/profile/${profile._id}`)
      }, 2000)
    } catch (error: any) {
      console.error("Update profile error:", error)
      setSaveStatus("error")

      if (error?.status === 401 || error?.data?.code === "MISSING_TOKEN") {
        setErrorMessage("Сессия истекла. Пожалуйста, перезагрузите страницу или попробуйте позже.")
      } else {
        setErrorMessage(error?.data?.error || error?.data?.message || "Произошла ошибка при сохранении")
      }
    }
  }

  const handleReset = () => {
    resetToOriginal()
    setSaveStatus("idle")
    setErrorMessage("")
    setHasValidationErrors(false)
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

  const isSaveDisabled = !hasChanges || isUpdating || hasValidationErrors

  const isStudentProfile = profile.role === "student"

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

        <div className={styles.topSection}>
          <div className={styles.avatarWrapper}>
            <AvatarSelector
              currentAvatar={formData.avatar || "/Avatars/Avatar1.webp"}
              onAvatarChange={(avatar) => updateField("avatar", avatar)}
            />
          </div>
          <div className={styles.personalInfoWrapper}>
            <PersonalInfoBlock
              data={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthday: formData.birthday,
              }}
              onChange={updateField}
            />
          </div>
        </div>

        <AboutBlock bio={formData.bio || ""} onChange={updateField} />

        {isStudentProfile ? (
          <StudentInfoBlock
            data={{
              placeWork: formData.placeWork,
              location: formData.location || "",
              gpa: (formData as StudentProfile).gpa,
              programType: (formData as StudentProfile).programType || "Бакалавриат",
            }}
            onChange={updateField}
          />
        ) : (
          <ProfessionalBlock
            data={{
              placeWork: formData.placeWork,
              location: formData.location || "",
              experience: (formData as AuthorProfile).experience || "",
              specialization: (formData as AuthorProfile).specialization || "",
            }}
            onChange={updateField}
          />
        )}

        <ContactsBlock
          contacts={formData.contacts || []}
          onChange={updateField}
          onValidationChange={handleContactsValidationChange}
        />

        <EducationBlock
          education={formData.education || []}
          onChange={updateField}
          onValidationChange={handleEducationValidationChange}
        />

        <div className={styles.bottomActions}>
          <button className={styles.cancelButton} onClick={handleCancel} disabled={isUpdating}>
            Отмена
          </button>
          <button className={styles.secondaryButton} onClick={handleReset} disabled={!hasChanges || isUpdating}>
            Сбросить
          </button>
          <button
            className={styles.primaryButton}
            onClick={handleSave}
            disabled={isSaveDisabled}
            title={hasValidationErrors ? "Исправьте ошибки в форме" : undefined}
          >
            {isUpdating ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </>
  )
}
