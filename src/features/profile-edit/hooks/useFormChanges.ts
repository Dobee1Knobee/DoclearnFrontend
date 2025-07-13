"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import type { Contact, Education, AuthorProfile, StudentProfile } from "@/entities/user/model/types"

type ProfileUnion = AuthorProfile | StudentProfile

type ProfileKeys = keyof AuthorProfile | keyof StudentProfile

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type ProfileChanges = DeepPartial<AuthorProfile> & DeepPartial<StudentProfile>

const areContactsEqual = (contacts1: Contact[], contacts2: Contact[]): boolean => {
  if (contacts1.length !== contacts2.length) return false

  return contacts1.every((contact1, index) => {
    const contact2 = contacts2[index]
    return (
      contact1.type.type === contact2.type.type &&
      contact1.type.label === contact2.type.label &&
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

export const useFormChanges = (initialData: ProfileUnion) => {
  const [formData, setFormData] = useState<ProfileUnion>(() => ({
    ...initialData,
    contacts: initialData.contacts || [],
    education: initialData.education || [],
    bio: initialData.bio || "",
  }))

  const originalData = useRef<ProfileUnion>(initialData)

  const updateOriginalData = useCallback((newData: ProfileUnion) => {
    originalData.current = newData
    setFormData({
      ...newData,
      contacts: newData.contacts || [],
      education: newData.education || [],
      bio: newData.bio || "",
    })
  }, [])

  const updateField = useCallback((field: ProfileKeys, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const getChangedFields = useCallback((): ProfileChanges => {
    const changes: ProfileChanges = {}
    const original = originalData.current

    const commonFields: (keyof ProfileUnion)[] = ["firstName", "lastName", "bio", "placeWork", "location", "avatar"]

    commonFields.forEach((field) => {
      const originalValue = original[field] || ""
      const currentValue = formData[field] || ""

      if (originalValue !== currentValue) {
        changes[field] = currentValue as any
      }
    })

    if (original.role === "student" && formData.role === "student") {
      const originalStudent = original as StudentProfile
      const currentStudent = formData as StudentProfile

      if (originalStudent.gpa !== currentStudent.gpa) {
        changes.gpa = currentStudent.gpa
      }

      if (originalStudent.programType !== currentStudent.programType) {
        changes.programType = currentStudent.programType
      }
    }
    else if (
      (original.role === "doctor" || original.role === "admin") &&
      (formData.role === "doctor" || formData.role === "admin")
    ) {
      const originalAuthor = original as AuthorProfile
      const currentAuthor = formData as AuthorProfile

      const originalExperience = originalAuthor.experience || ""
      const currentExperience = currentAuthor.experience || ""
      if (originalExperience !== currentExperience) {
        changes.experience = currentExperience
      }

      const originalSpecialization = originalAuthor.specialization || ""
      const currentSpecialization = currentAuthor.specialization || ""
      if (originalSpecialization !== currentSpecialization) {
        changes.specialization = currentSpecialization
      }
    }

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

    const originalEducation = original.education || []
    const currentEducation = formData.education || []
    if (!areEducationEqual(originalEducation, currentEducation)) {
      changes.education = currentEducation
    }

    return changes
  }, [formData])

  const hasChanges = useMemo(() => {
    return Object.keys(getChangedFields()).length > 0
  }, [getChangedFields])

  const resetToOriginal = useCallback(() => {
    setFormData({
      ...originalData.current,
      contacts: originalData.current.contacts || [],
      education: originalData.current.education || [],
      bio: originalData.current.bio || "",
    })
  }, [])

  const getDataToSend = useCallback(() => {
    const changedFields = getChangedFields()
    const cleanedData: Record<string, any> = {}

    Object.entries(changedFields).forEach(([key, value]) => {
      if (key === "contacts" && Array.isArray(value)) {
        const validContacts = (value as Contact[]).filter(isValidContact)
        if (validContacts.length > 0) {
          cleanedData[key] = validContacts
        }
      } else if (key === "education" && Array.isArray(value)) {
        const validEducation = (value as Education[]).filter(isValidEducation)
        if (validEducation.length > 0) {
          cleanedData[key] = validEducation
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

  return {
    formData,
    updateField,
    getChangedFields,
    getDataToSend,
    hasChanges,
    resetToOriginal,
    updateOriginalData,
  }
}
