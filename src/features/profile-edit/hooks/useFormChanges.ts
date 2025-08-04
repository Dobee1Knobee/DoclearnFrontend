"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import type {
  Contact,
  Education,
  Work,
  ScientificStatus,
  Specialization,
  SpecialistUser,
  PostgraduateUser,
  DoctorUser,
  ResearcherUser,
} from "@/entities/user/model/types"

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type ProfileChanges = DeepPartial<SpecialistUser> & {
  scientificStatus?: ScientificStatus
  specializations?: Specialization[]
}

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

const areScientificStatusEqual = (status1: ScientificStatus, status2: ScientificStatus): boolean => {
  return (
    status1.degree === status2.degree &&
    status1.title === status2.title &&
    status1.rank === status2.rank &&
    JSON.stringify(status1.interests.sort()) === JSON.stringify(status2.interests.sort())
  )
}

const areSpecializationsEqual = (spec1: Specialization[], spec2: Specialization[]): boolean => {
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
    edu.institution.trim() &&
      edu.degree.trim() &&
      edu.specialty.trim() &&
      edu.startDate &&
      (edu.isCurrently || edu.graduationYear),
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

const normalizeEducationForRole = (education: Education[], role: string): Education | Education[] => {
  if (role === "student") {
    return education.length > 0
      ? education[0]
      : {
          id: "",
          institution: "",
          degree: "Специалитет",
          specialty: "",
          startDate: "",
          graduationYear: "",
          isCurrently: false,
        }
  }
  return education
}

const hasScientificStatus = (user: SpecialistUser): user is PostgraduateUser | DoctorUser | ResearcherUser => {
  return user.role === "postgraduate" || user.role === "doctor" || user.role === "researcher"
}

const hasSpecializations = (user: SpecialistUser): user is DoctorUser | ResearcherUser => {
  return user.role === "doctor" || user.role === "researcher"
}

export const useFormChanges = (initialData: SpecialistUser) => {
  const [formData, setFormData] = useState<SpecialistUser & { uploadedAvatarFile?: File | null }>(() => ({
    ...initialData,
    contacts: initialData.contacts || [],
    workHistory: initialData.workHistory || [],
    bio: initialData.bio || "",
    experience: initialData.experience || "",
    uploadedAvatarFile: null,
  }))

  const originalData = useRef<SpecialistUser>(initialData)

  const updateOriginalData = useCallback((newData: SpecialistUser) => {
    originalData.current = newData
    setFormData({
      ...newData,
      contacts: newData.contacts || [],
      workHistory: newData.workHistory || [],
      bio: newData.bio || "",
      experience: newData.experience || "",
      uploadedAvatarFile: null,
    })
  }, [])

  const updateField = useCallback((field: keyof SpecialistUser, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      "mainSpecialization",
      "location",
      "experience",
      "avatar",
      "defaultAvatarPath",
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

    if (hasScientificStatus(original) && hasScientificStatus(formData)) {
      if (!areScientificStatusEqual(original.scientificStatus, formData.scientificStatus)) {
        changes.scientificStatus = formData.scientificStatus
      }
    }

    if (hasSpecializations(original) && hasSpecializations(formData)) {
      if (!areSpecializationsEqual(original.specializations, formData.specializations)) {
        changes.specializations = formData.specializations
      }
    }

    return changes
  }, [formData])

  const hasChanges = useMemo(() => {
    const profileChanges = Object.keys(getChangedFields()).length > 0
    const hasUploadedFile = Boolean(formData.uploadedAvatarFile)
    return profileChanges || hasUploadedFile
  }, [getChangedFields, formData.uploadedAvatarFile])

  const resetToOriginal = useCallback(() => {
    setFormData({
      ...originalData.current,
      contacts: originalData.current.contacts || [],
      workHistory: originalData.current.workHistory || [],
      bio: originalData.current.bio || "",
      experience: originalData.current.experience || "",
      uploadedAvatarFile: null,
    })
  }, [])

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
        const validEducation = (value as Education[]).filter(isValidEducation).map(({ id, ...rest }) => {
          if (rest.isCurrently) {
            const { graduationYear, ...educationWithoutGraduationYear } = rest
            return educationWithoutGraduationYear
          }
          return rest
        })
        if (validEducation.length > 0) {
          cleanedData[key] = validEducation
        }
      } else if (key === "education" && !Array.isArray(value)) {
        const education = value as Education
        if (isValidEducation(education)) {
          const { id, ...rest } = education
          if (rest.isCurrently) {
            const { graduationYear, ...educationWithoutGraduationYear } = rest
            cleanedData[key] = educationWithoutGraduationYear
          } else {
            cleanedData[key] = rest
          }
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
        if (status.degree || status.title || status.rank || status.interests.length > 0) {
          cleanedData[key] = status
        }
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

  const setUploadedAvatarFile = useCallback((file: File | null) => {
    setFormData((prev) => ({ ...prev, uploadedAvatarFile: file }))
  }, [])

  const clearUploadedAvatarFile = useCallback(() => {
    setFormData((prev) => ({ ...prev, uploadedAvatarFile: null }))
  }, [])

  return {
    formData,
    updateField,
    getChangedFields,
    getDataToSend,
    hasChanges,
    resetToOriginal,
    updateOriginalData,
    setUploadedAvatarFile,
    clearUploadedAvatarFile,
  }
}
