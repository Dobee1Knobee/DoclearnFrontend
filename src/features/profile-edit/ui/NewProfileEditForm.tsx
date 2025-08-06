"use client"

import type React from "react"
import type { SpecialistUser } from "@/entities/user/model/types"
import { PersonalInfoBlock } from "./blocks/PersonalInfoBlock"
import { AboutBlock } from "./blocks/AboutBlock"
import { ContactsBlock } from "./blocks/ContactsBlock"
import { NewEducationBlock } from "./blocks/NewEducationBlock"
import { AvatarSelector } from "./components/AvatarSelector"
import { UnsavedChangesWarning } from "./components/UnsavedChangesWarning"
import { NewProfileInfoBlock } from "./blocks/NewProfileInfoBlock"
import { ProfessionalStatusBlock } from "./blocks/ProfessionalStatusBlock"
import { WorkHistoryBlock } from "./blocks/WorkHistoryBlock"
import { ScientificStatusBlock } from "./blocks/ScientificStatusBlock"
import { SpecializationsBlock } from "./blocks/SpecializationsBlock"
import { useUploadAvatarMutation } from "../api/profileEditApi"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import { useNewFormChanges } from "../hooks/useNewFormChanges"
import { Alert } from "react-bootstrap"
import styles from "./ProfileEditForm.module.css"
import { useScrollToHash } from "@/shared/hooks/useScrollToHash"
import { useState } from "react"

interface NewProfileEditFormProps {
  profile: SpecialistUser
}

export const NewProfileEditForm: React.FC<NewProfileEditFormProps> = ({ profile }) => {
  useScrollToHash()

  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()
  const { cacheAvatar, invalidateAvatar } = useAvatarCache()

  // Состояния аватара (остаются в компоненте)
  const [uploadedAvatarFile, setUploadedAvatarFile] = useState<File | null>(null)
  const [avatarSaveStatus, setAvatarSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [avatarErrorMessage, setAvatarErrorMessage] = useState("")

  // Используем новый хук
  const {
    formData,
    hasChanges,
    hasValidationErrors,
    saveStatus,
    errorMessage,
    moderationMessage,
    isUpdating,
    updateField,
    handleRoleChange,
    handleSave: hookHandleSave,
    handleReset,
    handleCancel,
    redirectToProfile,
    setEducationErrors,
    setContactsErrors,
    setWorkHistoryErrors,
    setScientificStatusErrors,
    setSpecializationsErrors,
  } = useNewFormChanges(profile)

  // Функция для сброса defaultAvatarPath к исходному значению
  const handleResetDefaultAvatar = () => {
    updateField("defaultAvatarPath", profile.defaultAvatarPath || "")
  }

  // Модифицированный handleSave с поддержкой аватара и правильным переходом
  const handleSave = async () => {
    try {
      setAvatarSaveStatus("idle")
      setAvatarErrorMessage("")

      let avatarUploaded = false
      let profileUpdated = false

      // Загружаем аватар если есть файл
      if (uploadedAvatarFile) {
        try {
          const avatarResult = await uploadAvatar(uploadedAvatarFile).unwrap()
          const newAvatarUrl = avatarResult.data.avatarUrl
          const newAvatarId = avatarResult.data.avatarId || profile._id

          updateField("avatar", newAvatarUrl)
          setAvatarSaveStatus("success")
          avatarUploaded = true

          // Инвалидируем старый аватар если есть
          if (profile.avatarId) {
            const oldAvatarId = typeof profile.avatarId === "object" ? profile.avatarId._id : profile.avatarId
            if (oldAvatarId) {
              await invalidateAvatar(oldAvatarId)
            }
          }

          // Кэшируем новый аватар
          await cacheAvatar(newAvatarUrl, newAvatarId, profile._id)

          setUploadedAvatarFile(null)
        } catch (avatarError: any) {
          console.error("Avatar upload error:", avatarError)
          setAvatarSaveStatus("error")
          setAvatarErrorMessage(avatarError?.data?.error || avatarError?.data?.message || "Ошибка при загрузке аватара")
          return // Прерываем выполнение если аватар не загрузился
        }
      }

      // Вызываем сохранение профиля из хука
      const profileResult = await hookHandleSave()
      profileUpdated = profileResult.success

      // Переходим на страницу профиля если что-то было успешно сохранено
      if (avatarUploaded || (profileUpdated && profileResult.shouldRedirect)) {
        await redirectToProfile()
      }
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const handleResetWithAvatar = () => {
    handleReset()
    setUploadedAvatarFile(null)
    setAvatarSaveStatus("idle")
    setAvatarErrorMessage("")
  }

  const isSaveDisabled = (!hasChanges && !uploadedAvatarFile) || isUpdating || isUploadingAvatar || hasValidationErrors

  const renderRoleSpecificBlocks = () => {
    const role = formData.role

    const commonBlocks = (
      <>
        <NewEducationBlock
          education={
            Array.isArray(formData.education) ? formData.education : formData.education._id ? [formData.education] : []
          }
          onChange={(field: any, value: any) => updateField(field, value)}
          onValidationChange={setEducationErrors}
          role={formData.role}
        />

        <div id="contacts" style={{ marginBottom: "1.5rem" }}>
          <ContactsBlock
            contacts={formData.contacts || []}
            onChange={(field: any, value: any) => updateField(field, value)}
            onValidationChange={setContactsErrors}
          />
        </div>

        <WorkHistoryBlock
          workHistory={formData.workHistory || []}
          onChange={updateField}
          onValidationChange={setWorkHistoryErrors}
        />
      </>
    )

    if (role === "student" || role === "resident") {
      return commonBlocks
    }

    if (role === "postgraduate") {
      return (
        <>
          {commonBlocks}
          <ScientificStatusBlock
            scientificStatus={
              "scientificStatus" in formData
                ? formData.scientificStatus
                : {
                    degree: "Нет",
                    title: "Нет",
                    rank: "Нет",
                    interests: [],
                  }
            }
            onChange={updateField}
            onValidationChange={setScientificStatusErrors}
          />
        </>
      )
    }

    if (role === "doctor" || role === "researcher") {
      return (
        <>
          {commonBlocks}
          <ScientificStatusBlock
            scientificStatus={
              "scientificStatus" in formData
                ? formData.scientificStatus
                : {
                    degree: "Нет",
                    title: "Нет",
                    rank: "Нет",
                    interests: [],
                  }
            }
            onChange={updateField}
            onValidationChange={setScientificStatusErrors}
          />
          <SpecializationsBlock
            specializations={Array.isArray(formData.specializations) ? formData.specializations : []}
            onChange={updateField}
            onValidationChange={setSpecializationsErrors}
          />
        </>
      )
    }

    return commonBlocks
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

        {moderationMessage && (
          <Alert variant="info" className={styles.alert}>
            {moderationMessage}
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
              uploadedAvatarFile={uploadedAvatarFile}
              onAvatarChange={(defaultAvatarPath) => {
                updateField("defaultAvatarPath", defaultAvatarPath)
                setUploadedAvatarFile(null)
              }}
              onUploadedFileChange={setUploadedAvatarFile}
              onResetDefaultAvatar={handleResetDefaultAvatar}
              userId={profile._id}
              avatarId={profile.avatarId}
              avatarUrl={profile.avatarUrl}
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
              onChange={(field: any, value: any) => updateField(field, value)}
            />
          </div>
        </div>

        <NewProfileInfoBlock
          data={{
            location: formData.location || "",
            experience: formData.experience || "",
            placeWork: formData.placeWork || "",
            placeStudy: formData.placeStudy || "",
          }}
          onChange={updateField}
        />

        <AboutBlock bio={formData.bio || ""} onChange={(field: any, value: any) => updateField(field, value)} />

        <ProfessionalStatusBlock currentRole={formData.role} onChange={handleRoleChange} />

        {renderRoleSpecificBlocks()}

        <div className={styles.bottomActions}>
          <button className={styles.cancelButton} onClick={handleCancel} disabled={isUpdating}>
            Отмена
          </button>
          <button
            className={styles.secondaryButton}
            onClick={handleResetWithAvatar}
            disabled={!hasChanges || isUpdating}
          >
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
