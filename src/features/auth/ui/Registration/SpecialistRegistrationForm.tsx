"use client"

import type React from "react"
import { useEffect } from "react"
import { Button, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import styles from "../styles/AuthForm.module.css"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks"
import { FormInput } from "../inputs/FormInput"
import { PasswordInput } from "../inputs/PasswordInput"
import { validateName, validateOptionalName, validateEmail, validatePassword } from "@/shared/lib/validation"
import { errorMessages } from "@/shared/lib/errorMessages"
import type { RegisterSpecialistDto } from "@/features/auth/model/newTypes"

interface SpecialistRegistrationFormData extends Omit<RegisterSpecialistDto, "defaultAvatarPath" | "accountType"> {
  confirmPassword: string
}

interface SpecialistRegistrationFormProps {
  onSuccess: (email: string) => void
}

const SpecialistRegistrationForm: React.FC<SpecialistRegistrationFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SpecialistRegistrationFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      birthday: "",
      placeStudy: "",
      placeWork: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")


  const onSubmit = (data: SpecialistRegistrationFormData) => {
    const { confirmPassword, ...registerData } = data
    const formattedData: RegisterSpecialistDto = {
      ...registerData,
      role: "student",
      defaultAvatarPath: "/Avatars/Avatar1.webp",
    }
    console.log(">> Specialist Registration payload:", {
      formattedData,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <FormInput
        name="firstName"
        label="Имя"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validateName,
        }}
        error={errors.firstName}
        placeholder="Введите имя"
      />

      <FormInput
        name="lastName"
        label="Фамилия"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validateName,
        }}
        error={errors.lastName}
        placeholder="Введите фамилию"
      />

      <FormInput
        name="middleName"
        label="Отчество"
        control={control}
        rules={{
          validate: validateOptionalName,
        }}
        error={errors.middleName}
        placeholder="Введите отчество, если оно есть"
      />

      <FormInput
        name="birthday"
        label="Дата рождения"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: (value: string) => {
            const birthDate = new Date(value)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()

            if (age < 16) {
              return "Возраст должен быть не менее 16 лет"
            }
            if (age > 100) {
              return "Проверьте правильность даты рождения"
            }
            return true
          },
        }}
        error={errors.birthday}
        type="date"
      />

      <FormInput
        name="placeStudy"
        label="Место учёбы"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.placeStudy}
        placeholder="Введите место учёбы"
      />

      <FormInput
        name="placeWork"
        label="Место работы"
        control={control}
        rules={{
          required: errorMessages.required,
        }}
        error={errors.placeWork}
        placeholder="Введите место работы"
      />

      <FormInput
        name="email"
        label="Почта"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validateEmail,
        }}
        error={errors.email}
        placeholder="Введите почту"
        type="email"
      />

      <PasswordInput
        name="password"
        label="Пароль"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: validatePassword,
        }}
        error={errors.password}
        placeholder="Введите пароль"
      />

      <PasswordInput
        name="confirmPassword"
        label="Повторите пароль"
        control={control}
        rules={{
          required: errorMessages.required,
          validate: (value: string) => {
            if (value !== password) {
              return errorMessages.passwordMismatch
            }
            return true
          },
        }}
        error={errors.confirmPassword}
        placeholder="Повторите пароль"
      />


      <Button variant="primary" type="submit" className={styles.btnCustom} >
        Зарегистрироваться
      </Button>
    </form>
  )
}

export default SpecialistRegistrationForm
