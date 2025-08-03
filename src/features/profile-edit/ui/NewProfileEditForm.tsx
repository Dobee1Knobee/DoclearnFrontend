"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type {
  SpecialistUser,
  SpecialistRole,
  StudentUser,
  ResidentUser,
  PostgraduateUser,
  DoctorUser,
  ResearcherUser,
  Work
} from "@/entities/user/model/types"
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
import { useUpdateMyProfileMutation, useUploadAvatarMutation } from "../api/profileEditApi"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import { Alert } from "react-bootstrap"
import styles from "./ProfileEditForm.module.css"
import { useScrollToHash } from "@/shared/hooks/useScrollToHash"

interface NewProfileEditFormProps {
  profile: SpecialistUser
}

export const NewProfileEditForm: React.FC<NewProfileEditFormProps> = ({ profile }) => {
  useScrollToHash()
  const router = useRouter()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation()
  const { cacheAvatar, invalidateAvatar } = useAvatarCache()

  const [formData, setFormData] = useState<SpecialistUser>(profile)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [moderationMessage, setModerationMessage] = useState("")
  const [uploadedAvatarFile, setUploadedAvatarFile] = useState<File | null>(null)
  const [avatarSaveStatus, setAvatarSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [avatarErrorMessage, setAvatarErrorMessage] = useState("")
  const [hasValidationErrors, setHasValidationErrors] = useState(false)
  const [educationErrors, setEducationErrors] = useState(false)
  const [contactsErrors, setContactsErrors] = useState(false)
  const [workHistoryErrors, setWorkHistoryErrors] = useState(false)
  const [scientificStatusErrors, setScientificStatusErrors] = useState(false)
  const [specializationsErrors, setSpecializationsErrors] = useState(false)

  useEffect(() => {
    setHasValidationErrors(
      educationErrors || contactsErrors || workHistoryErrors || scientificStatusErrors || specializationsErrors,
    )
  }, [educationErrors, contactsErrors, workHistoryErrors, scientificStatusErrors, specializationsErrors])

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }) as SpecialistUser)
    setHasChanges(true)
  }

  const handleRoleChange = (newRole: SpecialistRole) => {
    setFormData((prev) => {
      const baseData = {
        _id: prev._id,
        firstName: prev.firstName,
        lastName: prev.lastName,
        middleName: prev.middleName,
        email: prev.email,
        birthday: prev.birthday,
        placeStudy: prev.placeStudy,
        placeWork: prev.placeWork,
        workHistory: prev.workHistory,
        mainSpecialization: prev.mainSpecialization,
        isVerified: prev.isVerified,
        createdAt: prev.createdAt,
        defaultAvatarPath: prev.defaultAvatarPath,
        location: prev.location,
        followers: prev.followers,
        following: prev.following,
        rating: prev.rating,
        publications: prev.publications,
        bio: prev.bio,
        achievements: prev.achievements,
        stats: prev.stats,
        contacts: prev.contacts,
        experience: prev.experience,
      }

      let education: any
      if (newRole === "student") {
        if (Array.isArray(prev.education)) {
          education =
            prev.education.length > 0
              ? { ...prev.education[0], degree: "Специалитет" }
              : {
                  id: "",
                  institution: "",
                  specialty: "",
                  startDate: "",
                  graduationYear: "",
                  isCurrently: false,
                  degree: "Специалитет",
                }
        } else {
          education = prev.education.id
            ? { ...prev.education, degree: "Специалитет" }
            : {
                id: "",
                institution: "",
                specialty: "",
                startDate: "",
                graduationYear: "",
                isCurrently: false,
                degree: "Специалитет",
              }
        }
      } else {
        if (Array.isArray(prev.education)) {
          education = prev.education
        } else {
          education = prev.education.id ? [{ ...prev.education, degree: prev.education.degree || "" }] : []
        }
      }

      switch (newRole) {
        case "student":
          return {
            ...baseData,
            role: "student",
            education,
          } as StudentUser

        case "resident":
          return {
            ...baseData,
            role: "resident",
            education,
          } as ResidentUser

        case "postgraduate":
          return {
            ...baseData,
            role: "postgraduate",
            education,
            scientificStatus:
              "scientificStatus" in prev
                ? prev.scientificStatus
                : {
                    degree: null,
                    title: null,
                    rank: null,
                    interests: [],
                  },
          } as PostgraduateUser

        case "doctor":
          return {
            ...baseData,
            role: "doctor",
            education,
            scientificStatus:
              "scientificStatus" in prev
                ? prev.scientificStatus
                : {
                    degree: null,
                    title: null,
                    rank: null,
                    interests: [],
                  },
            specializations: "specializations" in prev ? prev.specializations : [],
          } as DoctorUser

        case "researcher":
          return {
            ...baseData,
            role: "researcher",
            education,
            scientificStatus:
              "scientificStatus" in prev
                ? prev.scientificStatus
                : {
                    degree: null,
                    title: null,
                    rank: null,
                    interests: [],
                  },
            specializations: "specializations" in prev ? prev.specializations : [],
          } as ResearcherUser

        default:
          return prev
      }
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setSaveStatus("idle")
      setErrorMessage("")
      setModerationMessage("")
      setAvatarSaveStatus("idle")
      setAvatarErrorMessage("")

      let avatarUploaded = false
      let newAvatarUrl = ""
      let newAvatarId = ""

      // Загружаем аватар если есть файл
      if (uploadedAvatarFile) {
        try {
          const avatarResult = await uploadAvatar(uploadedAvatarFile).unwrap()
          newAvatarUrl = avatarResult.data.avatarUrl
          newAvatarId = avatarResult.data.avatarId || profile._id

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
        }
      }

      // Подготавливаем данные для отправки (только измененные поля)
      const dataToSend: any = {}

      // Сравниваем с оригинальными данными и добавляем только измененные поля
      Object.keys(formData).forEach((key) => {
        if (
          key !== "uploadedAvatarFile" &&
          formData[key as keyof SpecialistUser] !== profile[key as keyof SpecialistUser]
        ) {
          dataToSend[key] = formData[key as keyof SpecialistUser]
        }
      })
      
      if (dataToSend.workHistory) {
        dataToSend.workHistory = (
          (dataToSend.workHistory as Work[])
        ).map(({ id, ...rest }) => rest)
      }

      if (Object.keys(dataToSend).length > 0) {
        console.log("Отправляем данные профиля:", dataToSend)

        const result = await updateProfile(dataToSend).unwrap()
        setSaveStatus("success")

        if (result.data.requiresModeration) {
          setModerationMessage("Некоторые поля изменятся после проверки администратора")
        }
      } else if (!avatarUploaded) {
        console.log("Нет изменений для отправки")
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push(`/profile/${profile._id}`)
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
    setFormData(profile)
    setUploadedAvatarFile(null)
    setHasChanges(false)
    setSaveStatus("idle")
    setErrorMessage("")
    setModerationMessage("")
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

  const isSaveDisabled = (!hasChanges && !uploadedAvatarFile) || isUpdating || isUploadingAvatar || hasValidationErrors

  const renderRoleSpecificBlocks = () => {
    const role = formData.role

    const commonBlocks = (
      <>
        <NewEducationBlock
          education={
            Array.isArray(formData.education) ? formData.education : formData.education.id ? [formData.education] : []
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
                    degree: null,
                    title: null,
                    rank: null,
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
                    degree: null,
                    title: null,
                    rank: null,
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
            mainSpecialization: formData.mainSpecialization || "",
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
