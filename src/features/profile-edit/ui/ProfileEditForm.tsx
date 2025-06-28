"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
import { Alert } from "react-bootstrap"
import styles from "./ProfileEditForm.module.css"

interface ProfileEditFormProps {
  profile: AuthorProfile
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile }) => {
  const router = useRouter()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  const [formData, setFormData] = useState<AuthorProfile>(() => ({
    ...profile,
    contacts: profile.contacts || [],
    education: profile.education || [],
    bio: profile.bio || "",
  }))
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(profile)
    setHasUnsavedChanges(hasChanges)
  }, [formData, profile])

  const handleFieldChange = useCallback((field: keyof AuthorProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleSave = async () => {
    try {
      setSaveStatus("idle")
      setErrorMessage("")

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        // birthday: formData.birthday,
        bio: formData.bio || "",
        placeWork: formData.placeWork,
        location: formData.location || "",
        experience: formData.experience || "",
        specialization: formData.specialization || "",
        contacts: formData.contacts || [],
        education: formData.education || [],
        avatar: formData.avatar,
      }

      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0
          }
          return value !== "" && value !== null && value !== undefined
        }),
      )

      console.log("Form data being sent:", cleanedData)

      const result = await updateProfile(cleanedData).unwrap()

      setSaveStatus("success")
      setHasUnsavedChanges(false)

      setTimeout(() => {
        router.push(`/profile/${profile._id}`)
      }, 2000)
    } catch (error: any) {
      console.error("Update profile error:", error)
      setSaveStatus("error")
      setErrorMessage(error?.data?.error || error?.data?.message || "Произошла ошибка при сохранении")
    }
  }

  const handleReset = () => {
    setFormData({
      ...profile,
      contacts: profile.contacts || [],
      education: profile.education || [],
      bio: profile.bio || "",
    })
    setHasUnsavedChanges(false)
    setSaveStatus("idle")
    setErrorMessage("")
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("У вас есть несохраненные изменения. Вы уверены, что хотите выйти?")) {
        router.push(`/profile/${profile._id}`)
      }
    } else {
      router.push(`/profile/${profile._id}`)
    }
  }

  return (
    <>
      <UnsavedChangesWarning hasUnsavedChanges={hasUnsavedChanges} />

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
              onAvatarChange={(avatar) => handleFieldChange("avatar", avatar)}
            />
          </div>

          <div className={styles.rightColumn}>
            <PersonalInfoBlock
              data={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                birthday: formData.birthday,
              }}
              onChange={handleFieldChange}
            />

            <AboutBlock bio={formData.bio || ""} onChange={handleFieldChange} />

            <ProfessionalBlock
              data={{
                placeWork: formData.placeWork,
                location: formData.location || "",
                experience: formData.experience || "",
                specialization: formData.specialization || "",
              }}
              onChange={handleFieldChange}
            />

            <ContactsBlock contacts={formData.contacts || []} onChange={handleFieldChange} />

            <EducationBlock education={formData.education || []} onChange={handleFieldChange} />
          
          </div>

          <div className={styles.bottomActions}>
            <button className={styles.cancelButton} onClick={handleCancel} disabled={isUpdating}>
              Отмена
            </button>
            <button className={styles.secondaryButton} onClick={handleReset} disabled={!hasUnsavedChanges || isUpdating}>
              Сбросить
            </button>
            <button className={styles.primaryButton} onClick={handleSave} disabled={!hasUnsavedChanges || isUpdating}>
              {isUpdating ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
