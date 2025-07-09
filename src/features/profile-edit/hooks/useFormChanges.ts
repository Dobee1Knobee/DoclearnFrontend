"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import type { Contact, Education, AuthorProfile } from "@/entities/user/model/types"

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Функции для глубокого сравнения массивов
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

// Хук специально для работы с профилем автора
export const useFormChanges = (initialData: AuthorProfile) => {
  const [formData, setFormData] = useState<AuthorProfile>(() => ({
    ...initialData,
    contacts: initialData.contacts || [],
    education: initialData.education || [],
    bio: initialData.bio || "",
  }))

  const originalData = useRef<AuthorProfile>(initialData)

  // Обновляем исходные данные только при получении новых данных извне
  const updateOriginalData = useCallback((newData: AuthorProfile) => {
    originalData.current = newData
    setFormData({
      ...newData,
    //   contacts: newData.contacts || [],
    //   education: newData.education || [],
      bio: newData.bio || "",
    })
  }, [])

  // Функция для обновления отдельного поля
  const updateField = useCallback((field: keyof AuthorProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Функция для получения только измененных полей
  const getChangedFields = useCallback((): DeepPartial<AuthorProfile> => {
    const changes: DeepPartial<AuthorProfile> = {}
    const original = originalData.current

    // Типобезопасный список простых полей
    const simpleFields: (keyof AuthorProfile)[] = [
      "firstName",
      "lastName",
      "bio",
      "placeWork",
      "location",
      "experience",
      "specialization",
      "avatar",
    ]

    simpleFields.forEach((field) => {
      const originalValue = original[field] || ""
      const currentValue = formData[field] || ""

      if (originalValue !== currentValue) {
        changes[field] = currentValue as any
      }
    })

    // Специальная обработка даты рождения
    const originalBirthday = original.birthday?.split("T")[0] || ""
    const currentBirthday = formData.birthday?.split("T")[0] || ""
    if (originalBirthday !== currentBirthday) {
      changes.birthday = currentBirthday
    }

    // Глубокое сравнение контактов
    const originalContacts = original.contacts || []
    const currentContacts = formData.contacts || []
    if (!areContactsEqual(originalContacts, currentContacts)) {
      changes.contacts = currentContacts
    }

    // Глубокое сравнение образования
    const originalEducation = original.education || []
    const currentEducation = formData.education || []
    if (!areEducationEqual(originalEducation, currentEducation)) {
      changes.education = currentEducation
    }

    return changes
  }, [formData])

  // Проверка наличия изменений
  const hasChanges = useMemo(() => {
    return Object.keys(getChangedFields()).length > 0
  }, [getChangedFields])

  // Сброс к исходным данным
  const resetToOriginal = useCallback(() => {
    setFormData({
      ...originalData.current,
      contacts: originalData.current.contacts || [],
      education: originalData.current.education || [],
      bio: originalData.current.bio || "",
    })
  }, [])

  // Получение данных для отправки (только измененные поля, очищенные от пустых значений)
  const getDataToSend = useCallback(() => {
    const changedFields = getChangedFields()
    const cleanedData: Partial<AuthorProfile> = {}

    Object.entries(changedFields).forEach(([key, value]) => {
      const typedKey = key as keyof AuthorProfile

      if (Array.isArray(value)) {
        if (value.length > 0) {
          cleanedData[typedKey] = value as any
        }
      } else if (value !== "" && value !== null && value !== undefined) {
        cleanedData[typedKey] = value as any
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
