import { errorMessages } from "./errorMessages"

const nameRegex = /^\p{L}[\p{L}-]*\p{L}$/u
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const uppercaseRegex = /[A-Z]/

export const validateName = (value: string): true | string => {
  if (!value) return errorMessages.required
  if (!nameRegex.test(value)) return errorMessages.invalidName
  return true
}

export const validateEmail = (value: string) => {
  if (!value) return errorMessages.required
  if (!emailRegex.test(value)) return errorMessages.invalidEmail
  return true
}

export const validatePassword = (value: string) => {
  if (!value) return errorMessages.required
  if (value.length < 6) return errorMessages.passwordTooShort
  if (!uppercaseRegex.test(value)) return errorMessages.passwordNoUppercase
  return true
}

