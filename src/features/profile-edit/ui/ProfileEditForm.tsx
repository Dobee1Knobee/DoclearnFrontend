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
import { useUpdateMyProfileMutation, useUploadAvatarMutation } from "../api/profileEditApi"
import { useFormChanges } from "@/features/profile-edit/hooks/useFormChanges"
import { Alert } from "react-bootstrap"
import styles from "./ProfileEditForm.module.css"
import { useScrollToHash } from "@/shared/hooks/useScrollToHash"

interface ProfileEditFormProps {
  profile: AuthorProfile | StudentProfile
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile }) => {
  useScrollToHash()
  const router = useRouter()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  const {
    formData,
    updateField,
    getDataToSend,
    hasChanges,
    resetToOriginal,
    updateOriginalData,
    setUploadedAvatarFile,
    clearUploadedAvatarFile,
  } = useFormChanges(profile)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [avatarSaveStatus, setAvatarSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [avatarErrorMessage, setAvatarErrorMessage] = useState("")
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()
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
      setAvatarSaveStatus("idle")
      setAvatarErrorMessage("")

      const dataToSend = getDataToSend()
      let avatarUploaded = false

      if (formData.uploadedAvatarFile) {
        try {
          const avatarResult = await uploadAvatar(formData.uploadedAvatarFile).unwrap()

          updateField("avatar", avatarResult.data.avatarUrl)


          setAvatarSaveStatus("success")
          avatarUploaded = true

          clearUploadedAvatarFile()
        } catch (avatarError: any) {
          console.error("Avatar upload error:", avatarError)
          setAvatarSaveStatus("error")
          setAvatarErrorMessage(avatarError?.data?.error || avatarError?.data?.message || "Ошибка при загрузке аватара")
        }
      }

      if (Object.keys(dataToSend).length > 0) {
        console.log("Отправляем данные профиля:", dataToSend)

        const result = await updateProfile(dataToSend).unwrap()
        setSaveStatus("success")

        setTimeout(() => {
          router.push(`/profile/${profile._id}`)
        }, 2000)
      } else if (!avatarUploaded) {
        console.log("Нет изменений для отправки")
        return
      } else {
        setTimeout(() => {
          router.push(`/profile/${profile._id}`)
        }, 2000)
      }
    } catch (error: any) {
      console.error("Update profile error:", error)
      setSaveStatus("error")

      if (error?.status === 401 || error?.data?.code === "MISSING_TOKEN") {
        setErrorMessage("Сессия истекла. Пожалуйста, перезагрузите страницу или попробуйте позже.")
      } else {
        setErrorMessage(error?.data?.error || error?.data?.message || "Произошла ошибка при сохранении профиля")
      }
    }
  }

  const handleReset = () => {
    resetToOriginal()
    setSaveStatus("idle")
    setErrorMessage("")
    setAvatarSaveStatus("idle")
    setAvatarErrorMessage("")
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

  const isSaveDisabled =
    (!hasChanges && !formData.uploadedAvatarFile) || isUpdating || isUploadingAvatar || hasValidationErrors

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

        {avatarSaveStatus === "success" && (
          <Alert variant="success" className={styles.alert}>
            Аватар успешно загружен!
          </Alert>
        )}

        {avatarSaveStatus === "error" && (
          <Alert variant="danger" className={styles.alert}>
            {avatarErrorMessage}
          </Alert>
        )}

        <div className={styles.topSection}>
          <div className={styles.avatarWrapper}>
            <AvatarSelector
              currentAvatar={formData.avatar || ""}
              defaultAvatarPath={formData.defaultAvatarPath || "/Avatars/Avatar1.webp"}
              uploadedAvatarFile={formData.uploadedAvatarFile || null}
              onAvatarChange={(defaultAvatarPath) => {
                updateField("defaultAvatarPath", defaultAvatarPath)
                clearUploadedAvatarFile()
              }}
              onUploadedFileChange={setUploadedAvatarFile}
            />
          </div>
          <div className={styles.personalInfoWrapper}>
            <PersonalInfoBlock
              data={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                middleName: formData.middleName,
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

        <div id="contacts" style={{ marginBottom: "1.5rem" }}>
          <ContactsBlock
            contacts={formData.contacts || []}
            onChange={updateField}
            onValidationChange={handleContactsValidationChange}
          />
        </div>

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
            {isUpdating || isUploadingAvatar ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </>
  )
}
