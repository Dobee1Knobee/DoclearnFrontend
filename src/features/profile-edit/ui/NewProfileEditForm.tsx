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

  const [uploadedAvatarFile, setUploadedAvatarFile] = useState<File | null>(null)
  const [avatarSaveStatus, setAvatarSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [avatarErrorMessage, setAvatarErrorMessage] = useState("")

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
    attemptedSave,
    setAttemptedSave,
  } = useNewFormChanges(profile)

  const handleResetDefaultAvatar = () => {
    updateField("defaultAvatarPath", profile.defaultAvatarPath || "")
  }

  const handleSave = async () => {
    try {
      setAttemptedSave(true)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const hasErrors = checkFormValidation()
      if (hasErrors) {
        console.log("Validation errors found, not sending any requests")
        return
      }

      setAvatarSaveStatus("idle")
      setAvatarErrorMessage("")

      let avatarUploaded = false
      let profileUpdated = false

      if (uploadedAvatarFile) {
        try {
          const avatarResult = await uploadAvatar(uploadedAvatarFile).unwrap()
          const newAvatarUrl = avatarResult.data.avatarUrl
          const newAvatarId = avatarResult.data.avatarId || profile._id

          updateField("avatar", newAvatarUrl)
          setAvatarSaveStatus("success")
          avatarUploaded = true

          if (profile.avatarId) {
            const oldAvatarId = typeof profile.avatarId === "object" ? profile.avatarId._id : profile.avatarId
            if (oldAvatarId) {
              await invalidateAvatar(oldAvatarId)
            }
          }

          await cacheAvatar(newAvatarUrl, newAvatarId, profile._id)

          setUploadedAvatarFile(null)
        } catch (avatarError: any) {
          console.error("Avatar upload error:", avatarError)
          setAvatarSaveStatus("error")
          setAvatarErrorMessage(avatarError?.data?.error || avatarError?.data?.message || "Ошибка при загрузке аватара")
          return
        }
      }

      const profileResult = await hookHandleSave()
      profileUpdated = profileResult.success

      if (avatarUploaded || (profileUpdated && profileResult.shouldRedirect)) {
        await redirectToProfile()
      }
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const checkFormValidation = (): boolean => {
    let hasErrors = false

    const isValidContact = (contact: any): boolean => {
      return Boolean(contact.value && contact.value.trim() !== "")
    }

    const isValidEducation = (edu: any): boolean => {
      return Boolean(
        edu.institution.trim() &&
          edu.degree.trim() &&
          edu.specialty.trim() &&
          edu.startDate &&
          (edu.isCurrently || edu.graduationYear),
      )
    }

    const isValidWork = (work: any): boolean => {
      return Boolean(
        work.organizationName.trim() && work.position.trim() && work.startDate && (work.isCurrently || work.endDate),
      )
    }

    const isValidSpecialization = (spec: any): boolean => {
      return Boolean(spec.name.trim() && spec.method && spec.specializationId.trim())
    }

    const normalizeEducationToArray = (education: any): any[] => {
      if (Array.isArray(education)) {
        return education
      }
      if (education.institution || education.degree || education.specialty) {
        return [education]
      }
      return []
    }

    const educationArray = normalizeEducationToArray(formData.education)
    if (educationArray.length > 0) {
      educationArray.forEach((edu) => {
        if (!isValidEducation(edu)) {
          hasErrors = true
        }
      })
    }

    const contacts = formData.contacts || []
    if (contacts.length > 0) {
      contacts.forEach((contact) => {
        if (!isValidContact(contact)) {
          hasErrors = true
        }
      })
    }

    const workHistory = formData.workHistory || []
    if (workHistory.length > 0) {
      workHistory.forEach((work) => {
        if (!isValidWork(work)) {
          hasErrors = true
        }
      })
    }

    if (formData.role === "doctor" || formData.role === "researcher") {
      const specializations = Array.isArray(formData.specializations) ? formData.specializations : []
      if (specializations.length > 0) {
        specializations.forEach((spec) => {
          if (!isValidSpecialization(spec)) {
            hasErrors = true
          }
        })
      }
    }

    return hasErrors
  }

  const handleResetWithAvatar = () => {
    handleReset()
    setUploadedAvatarFile(null)
    setAvatarSaveStatus("idle")
    setAvatarErrorMessage("")
    setAttemptedSave(false)
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
          attemptedSave={attemptedSave}
        />

        <div id="contacts" style={{ marginBottom: "1.5rem" }}>
          <ContactsBlock
            contacts={formData.contacts || []}
            onChange={(field: any, value: any) => updateField(field, value)}
            onValidationChange={setContactsErrors}
            attemptedSave={attemptedSave}
          />
        </div>

        <WorkHistoryBlock
          workHistory={formData.workHistory || []}
          onChange={updateField}
          onValidationChange={setWorkHistoryErrors}
          attemptedSave={attemptedSave}
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
                    degree: null,
                    title: null,
                    rank: null,
                    interests: [],
                  }
            }
            onChange={updateField}
            attemptedSave={attemptedSave}
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
                    degree: null,
                    title: null,
                    rank: null,
                    interests: [],
                  }
            }
            onChange={updateField}
            attemptedSave={attemptedSave}
          />
          <SpecializationsBlock
            specializations={Array.isArray(formData.specializations) ? formData.specializations : []}
            onChange={updateField}
            onValidationChange={setSpecializationsErrors}
            attemptedSave={attemptedSave}
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

        {attemptedSave && hasValidationErrors && (
          <Alert variant="warning" className={styles.alert}>
            Исправьте ошибки в форме перед сохранением
          </Alert>
        )}

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
