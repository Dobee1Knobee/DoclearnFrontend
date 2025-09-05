import { errorMessages } from "./errorMessages"

const nameRegex = /^\p{L}[\p{L}-]*\p{L}$/u
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const uppercaseRegex = /[A-Z]/
const digitRegex = /[0-9]/
const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
const cyrillicRegex = /[а-яё]/i
const phoneRegex = /^\+?[\d\s\-()]{10,}$/

export const validateName = (value: string): true | string => {
  if (!value || value.trim() === "") return errorMessages.required
  if (!nameRegex.test(value.trim())) return errorMessages.invalidName
  return true
}

export const validateOptionalName = (value: string): true | string => {
  if (!value || value.trim() === "") return true
  if (!nameRegex.test(value.trim())) return errorMessages.invalidName
  return true
}

export const validateEmail = (value: string) => {
  if (!value) return errorMessages.required
  if (!emailRegex.test(value)) return errorMessages.invalidEmail
  return true
}

export const validatePassword = (value: string) => {
  if (!value) return errorMessages.required
  if (value.length < 8) return errorMessages.passwordTooShort
  if (!uppercaseRegex.test(value)) return errorMessages.passwordNoUppercase
  if (!digitRegex.test(value) && !specialCharRegex.test(value)) return errorMessages.passwordNoDigitOrSpecial
  if (cyrillicRegex.test(value)) return errorMessages.passwordContainsCyrillic
  return true
}

export const validatePhone = (value: string): true | string => {
  if (!value) return errorMessages.required
  if (!phoneRegex.test(value)) return "Некорректный номер телефона"
  return true
}

export const validateUrl = (value: string): true | string => {
  if (!value) return errorMessages.required
  try {
    new URL(value.startsWith("http") ? value : `https://${value}`)
    return true
  } catch {
    return "Некорректный URL"
  }
}

export const validateTitle = (value: string): true | string => {
  if (!value || value.trim() === "") return errorMessages.required
  return true
}

export const validateOrganizer = (value: string): true | string => {
  if (!value || value.trim() === "") return errorMessages.required
  return true
}

export const validateDate = (value: string): true | string => {
  if (!value) return errorMessages.required
  const date = new Date(value)
  if (isNaN(date.getTime())) return "Некорректная дата"
  if (date < new Date()) return "Дата не может быть в прошлом"
  return true
}

export const validateTime = (value: string): true | string => {
  if (!value) return errorMessages.required
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(value)) return "Некорректное время"
  return true
}

export const validateOptionalUrl = (value: string): true | string => {
  if (!value || value.trim() === "") return true
  return validateUrl(value)
}

export const validateOptionalEmail = (value: string): true | string => {
  if (!value || value.trim() === "") return true
  return validateEmail(value)
}

export const validateOptionalPhone = (value: string): true | string => {
  if (!value || value.trim() === "") return true
  return validatePhone(value)
}
