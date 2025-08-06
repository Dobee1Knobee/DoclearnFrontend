"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import type {
  Contact,
  Education,
  Work,
  ScientificStatus,
  Specialization,
  SpecialistUser,
  SpecialistRole,
  StudentUser,
  ResidentUser,
  PostgraduateUser,
  DoctorUser,
  ResearcherUser,
} from "@/entities/user/model/types"
import { useUpdateMyProfileMutation } from "../api/profileEditApi"
import { checkAuthStatus } from "@/features/auth/model/thunks"
import { useAppDispatch } from "@/shared/hooks/hooks"

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type ProfileChanges = DeepPartial<SpecialistUser> & {
  scientificStatus?: ScientificStatus
  specializations?: Specialization[]
}

const createDefaultScientificStatus = (): ScientificStatus => ({
  degree: "Нет",
  title: "Нет",
  rank: "Нет",
  interests: [],
})

const areContactsEqual = (contacts1: Contact[], contacts2: Contact[]): boolean => {
  if (contacts1.length !== contacts2.length) return false

  return contacts1.every((contact1, index) => {
    const contact2 = contacts2[index]
    return (
      contact1.type === contact2.type &&
      contact1.label === contact2.label &&
      contact1.value === contact2.value &&
      Boolean(contact1.isPublic) === Boolean(contact2.isPublic)
    )
  })
}

const areEducationEqual = (edu1: Education[], edu2: Education[]): boolean => {
  if (edu1.length !== edu2.length) return false

  return edu1.every((item1, index) => {
    const item2 = edu2[index]
    return (
      item1.institution === item2.institution &&
      (item1.degree || "") === (item2.degree || "") &&
      item1.startDate === item2.startDate &&
      (item1.specialty || "") === (item2.specialty || "") &&
      (item1.graduationYear || "") === (item2.graduationYear || "") &&
      Boolean(item1.isCurrently) === Boolean(item2.isCurrently)
    )
  })
}

const areWorkHistoryEqual = (work1: Work[], work2: Work[]): boolean => {
  if (work1.length !== work2.length) return false

  return work1.every((item1, index) => {
    const item2 = work2[index]
    return (
      item1.organizationName === item2.organizationName &&
      item1.position === item2.position &&
      item1.startDate === item2.startDate &&
      (item1.endDate || "") === (item2.endDate || "") &&
      Boolean(item1.isCurrently) === Boolean(item2.isCurrently) &&
      (item1.organizationId || "") === (item2.organizationId || "")
    )
  })
}

const areScientificStatusEqual = (status1?: ScientificStatus, status2?: ScientificStatus): boolean => {
  if (!status1 && !status2) return true

  if (!status1 || !status2) return false

  return (
    status1.degree === status2.degree &&
    status1.title === status2.title &&
    status1.rank === status2.rank &&
    JSON.stringify(status1.interests.sort()) === JSON.stringify(status2.interests.sort())
  )
}

const areSpecializationsEqual = (spec1?: Specialization[], spec2?: Specialization[]): boolean => {
  if (!Array.isArray(spec1) || !Array.isArray(spec2)) {
    if (!spec1 && !spec2) return true
    return false
  }

  if (spec1.length !== spec2.length) return false

  return spec1.every((item1, index) => {
    const item2 = spec2[index]
    return (
      item1.name === item2.name &&
      item1.method === item2.method &&
      item1.qualificationCategory === item2.qualificationCategory
    )
  })
}

const isValidContact = (contact: Contact): boolean => {
  return Boolean(contact.value && contact.value.trim() !== "")
}

const isValidEducation = (edu: Education): boolean => {
  return Boolean(
    edu.institution.trim() && edu.degree.trim() && edu.specialty.trim() && edu.startDate && edu.graduationYear, // Убрали проверку isCurrently, теперь graduationYear всегда обязателен
  )
}

const isValidWork = (work: Work): boolean => {
  return Boolean(
    work.organizationName.trim() && work.position.trim() && work.startDate && (work.isCurrently || work.endDate),
  )
}

const isValidSpecialization = (spec: Specialization): boolean => {
  return Boolean(spec.name.trim() && spec.method && spec.qualificationCategory)
}

const normalizeEducationToArray = (education: Education | Education[]): Education[] => {
  if (Array.isArray(education)) {
    return education
  }
  if (education.institution || education.degree || education.specialty) {
    return [education]
  }
  return []
}

const normalizeEducationForRole = (education: Education[], role: string): Education[] => {
  if (role === "student") {
    return education.length > 0
      ? [education[0]]
      : [{
          _id: "",
          institution: "",
          degree: "Специалитет",
          specialty: "",
          startDate: "",
          graduationYear: "",
          isCurrently: false,
        }]
  }
  return education
}

const hasScientificStatus = (user: SpecialistUser): user is PostgraduateUser | DoctorUser | ResearcherUser => {
  return user.role === "postgraduate" || user.role === "doctor" || user.role === "researcher"
}

const hasSpecializations = (user: SpecialistUser): user is DoctorUser | ResearcherUser => {
  return user.role === "doctor" || user.role === "researcher"
}

const getScientificStatusSafely = (user: SpecialistUser): ScientificStatus | undefined => {
  if (hasScientificStatus(user)) {
    return user.scientificStatus || createDefaultScientificStatus()
  }
  return undefined
}

const getSpecializationsSafely = (user: SpecialistUser): Specialization[] => {
  if (hasSpecializations(user)) {
    return user.specializations || []
  }
  return []
}

const normalizeUserData = (userData: SpecialistUser): SpecialistUser => {
  const baseData = {
    ...userData,
    contacts: userData.contacts || [],
    workHistory: userData.workHistory || [],
    bio: userData.bio || "",
    experience: userData.experience || "",
  }

  if (hasScientificStatus(baseData)) {
    const normalizedData = {
      ...baseData,
      scientificStatus: baseData.scientificStatus || createDefaultScientificStatus(),
    } as SpecialistUser

    if (hasSpecializations(normalizedData)) {
      return {
        ...normalizedData,
        specializations: (normalizedData as DoctorUser | ResearcherUser).specializations || [],
      } as SpecialistUser
    }

    return normalizedData
  }

  return baseData
}

export const useNewFormChanges = (initialData: SpecialistUser) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation()

  const normalizedInitialData = normalizeUserData(initialData)

  const [formData, setFormData] = useState<SpecialistUser>(normalizedInitialData)

  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [moderationMessage, setModerationMessage] = useState("")

  const [educationErrors, setEducationErrors] = useState(false)
  const [contactsErrors, setContactsErrors] = useState(false)
  const [workHistoryErrors, setWorkHistoryErrors] = useState(false)
  const [scientificStatusErrors, setScientificStatusErrors] = useState(false)
  const [specializationsErrors, setSpecializationsErrors] = useState(false)
  const [attemptedSave, setAttemptedSave] = useState(false)

  const originalData = useRef<SpecialistUser>(normalizedInitialData)

  const updateOriginalData = useCallback((newData: SpecialistUser) => {
    const normalizedData = normalizeUserData(newData)
    originalData.current = normalizedData
    setFormData(normalizedData)
  }, [])

  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }) as SpecialistUser)
  }, [])

  const handleRoleChange = useCallback((newRole: SpecialistRole) => {
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
        documents: prev.documents,
        experience: prev.experience,
      }

      let education: any
      if (newRole === "student") {
        if (Array.isArray(prev.education)) {
          education =
            prev.education.length > 0
              ? { ...prev.education[0], degree: "Специалитет" }
              : {
                  _id: "",
                  institution: "",
                  specialty: "",
                  startDate: "",
                  graduationYear: "",
                  isCurrently: false,
                  degree: "Специалитет",
                }
        } else {
          education = prev.education._id
            ? { ...prev.education, degree: "Специалитет" }
            : {
                _id: "",
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
          education = prev.education._id ? [{ ...prev.education, degree: prev.education.degree || "" }] : []
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
            scientificStatus: getScientificStatusSafely(prev) || createDefaultScientificStatus(),
          } as PostgraduateUser

        case "doctor":
          return {
            ...baseData,
            role: "doctor",
            education,
            scientificStatus: getScientificStatusSafely(prev) || createDefaultScientificStatus(),
            specializations: getSpecializationsSafely(prev),
          } as DoctorUser

        case "researcher":
          return {
            ...baseData,
            role: "researcher",
            education,
            scientificStatus: getScientificStatusSafely(prev) || createDefaultScientificStatus(),
            specializations: getSpecializationsSafely(prev),
          } as ResearcherUser

        default:
          return prev
      }
    })
  }, [])

  const getChangedFields = useCallback((): ProfileChanges => {
    const changes: ProfileChanges = {}
    const original = originalData.current

    const commonFields: (keyof SpecialistUser)[] = [
      "firstName",
      "lastName",
      "middleName",
      "bio",
      "placeWork",
      "placeStudy",
      "location",
      "experience",
      "avatar",
      "defaultAvatarPath",
      "role",
    ]

    commonFields.forEach((field) => {
      const originalValue = original[field] || ""
      const currentValue = formData[field] || ""

      if (originalValue !== currentValue) {
        ;(changes as any)[field] = currentValue
      }
    })

    const originalBirthday = original.birthday?.split("T")[0] || ""
    const currentBirthday = formData.birthday?.split("T")[0] || ""
    if (originalBirthday !== currentBirthday) {
      changes.birthday = currentBirthday
    }

    const originalContacts = original.contacts || []
    const currentContacts = formData.contacts || []
    if (!areContactsEqual(originalContacts, currentContacts)) {
      changes.contacts = currentContacts
    }

    const originalWorkHistory = original.workHistory || []
    const currentWorkHistory = formData.workHistory || []
    if (!areWorkHistoryEqual(originalWorkHistory, currentWorkHistory)) {
      changes.workHistory = currentWorkHistory
    }

    const originalEducationArray = normalizeEducationToArray(original.education)
    const currentEducationArray = normalizeEducationToArray(formData.education)
    if (!areEducationEqual(originalEducationArray, currentEducationArray)) {
      changes.education = normalizeEducationForRole(currentEducationArray, formData.role) as any
    }

    const originalScientificStatus = getScientificStatusSafely(original)
    const currentScientificStatus = getScientificStatusSafely(formData)

    if (!areScientificStatusEqual(originalScientificStatus, currentScientificStatus)) {
      changes.scientificStatus = currentScientificStatus
    }

    const originalSpecializations = getSpecializationsSafely(original)
    const currentSpecializations = getSpecializationsSafely(formData)

    if (!areSpecializationsEqual(originalSpecializations, currentSpecializations)) {
      changes.specializations = currentSpecializations
    }

    return changes
  }, [formData])

  const getDataToSend = useCallback(() => {
    const changedFields = getChangedFields()
    const cleanedData: Record<string, any> = {}

    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === "contacts" && Array.isArray(value)) {
        const validContacts = (value as Contact[]).filter(isValidContact).map(({ _id, ...rest }) => rest)
        if (validContacts.length > 0) {
          cleanedData[key] = validContacts
        }
      } else if (key === "education" && Array.isArray(value)) {
        const validEducation = (value as Education[]).filter(isValidEducation).map(({ _id, ...rest }) => {
          return rest
        })
        if (validEducation.length > 0) {
          cleanedData[key] = validEducation
        }
      } else if (key === "workHistory" && Array.isArray(value)) {
        const validWork = (value as Work[]).filter(isValidWork).map(({ id, ...rest }) => rest)
        if (validWork.length > 0) {
          cleanedData[key] = validWork
        }
      } else if (key === "specializations" && Array.isArray(value)) {
        const validSpecializations = (value as Specialization[])
          .filter(isValidSpecialization)
          .map(({ id, ...rest }) => rest)
        if (validSpecializations.length > 0) {
          cleanedData[key] = validSpecializations
        }
      } else if (key === "scientificStatus" && value) {
        const status = value as ScientificStatus
        cleanedData[key] = status
      } else if (key === "role") {
        cleanedData[key] = value
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          cleanedData[key] = value
        }
      } else if (value !== "" && value !== null && value !== undefined) {
        cleanedData[key] = value
      }
    })

    return cleanedData
  }, [getChangedFields])

  const hasChanges = useMemo(() => {
    return Object.keys(getChangedFields()).length > 0
  }, [getChangedFields])

  const checkAllValidation = useCallback(() => {
    if (!attemptedSave) return false

    let hasErrors = false

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

    if (hasScientificStatus(formData)) {
      const scientificStatus = getScientificStatusSafely(formData)
      if (scientificStatus && !scientificStatus.degree) {
        hasErrors = true
      }
    }

    if (hasSpecializations(formData)) {
      const specializations = getSpecializationsSafely(formData)
      if (specializations.length > 0) {
        specializations.forEach((spec) => {
          if (!isValidSpecialization(spec)) {
            hasErrors = true
          }
        })
      }
    }

    return hasErrors
  }, [formData, attemptedSave])

  const hasValidationErrors = useMemo(() => {
    const blockErrors =
      educationErrors || contactsErrors || workHistoryErrors || scientificStatusErrors || specializationsErrors

    if (attemptedSave) {
      return blockErrors || checkAllValidation()
    }

    return blockErrors
  }, [
    attemptedSave,
    checkAllValidation,
    educationErrors,
    contactsErrors,
    workHistoryErrors,
    scientificStatusErrors,
    specializationsErrors,
  ])

  const handleSave = useCallback(async (): Promise<{
    success: boolean
    shouldRedirect: boolean
    hasValidationErrors?: boolean
  }> => {
    try {
      setSaveStatus("idle")
      setErrorMessage("")
      setModerationMessage("")

      const dataToSend = getDataToSend()

      if (Object.keys(dataToSend).length > 0) {
        console.log("Отправляем данные профиля:", dataToSend)

        const result = await updateProfile(dataToSend).unwrap()
        setSaveStatus("success")

        if (result.data.requiresModeration) {
          setModerationMessage("Некоторые поля изменятся после проверки администратора")
        }

        updateOriginalData({ ...formData, ...dataToSend } as SpecialistUser)

        return { success: true, shouldRedirect: true }
      } else {
        console.log("Нет изменений профиля для отправки")
        return { success: true, shouldRedirect: false }
      }
    } catch (error: any) {
      console.error("Update profile error:", error)
      setSaveStatus("error")

      if (error?.status === 401 || error?.data?.code === "MISSING_TOKEN") {
        try {
          const authResult = await dispatch(checkAuthStatus()).unwrap()
          if (authResult) {
            console.log("Token refreshed, retrying save...")
            return await handleSave()
          } else {
            setSaveStatus("error")
            setErrorMessage("Сессия истекла. Необходимо войти заново.")
            return { success: false, shouldRedirect: false }
          }
        } catch (authError) {
          console.error("Auth refresh error:", authError)
          setSaveStatus("error")
          setErrorMessage("Сессия истекла. Необходимо войти заново.")
          return { success: false, shouldRedirect: false }
        }
      } else {
        setErrorMessage(error?.data?.error || error?.data?.message || "Произошла ошибка при сохранении профиля")
      }

      return { success: false, shouldRedirect: false }
    }
  }, [getDataToSend, updateProfile, formData, updateOriginalData])

  const redirectToProfile = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push(`/profile/${initialData._id}`)
  }, [router, initialData._id])

  const handleReset = useCallback(() => {
    setFormData({
      ...originalData.current,
      contacts: originalData.current.contacts || [],
      workHistory: originalData.current.workHistory || [],
      bio: originalData.current.bio || "",
      experience: originalData.current.experience || "",
    })
    setSaveStatus("idle")
    setErrorMessage("")
    setModerationMessage("")
    setEducationErrors(false)
    setContactsErrors(false)
    setWorkHistoryErrors(false)
    setScientificStatusErrors(false)
    setSpecializationsErrors(false)
    setAttemptedSave(false)
  }, [])

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      if (window.confirm("У вас есть несохраненные изменения. Вы уверены, что хотите выйти?")) {
        router.push(`/profile/${initialData._id}`)
      }
    } else {
      router.push(`/profile/${initialData._id}`)
    }
  }, [hasChanges, router, initialData._id])

  return {
    formData,
    hasChanges,
    hasValidationErrors,

    saveStatus,
    errorMessage,
    moderationMessage,
    isUpdating,

    educationErrors,
    contactsErrors,
    workHistoryErrors,
    scientificStatusErrors,
    specializationsErrors,
    attemptedSave,
    setAttemptedSave,

    updateField,
    handleRoleChange,
    getChangedFields,
    getDataToSend,
    updateOriginalData,

    handleSave,
    handleReset,
    handleCancel,
    redirectToProfile,

    setEducationErrors,
    setContactsErrors,
    setWorkHistoryErrors,
    setScientificStatusErrors,
    setSpecializationsErrors,
  }
}
