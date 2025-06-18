"use client"

import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap"
import { useForm } from "react-hook-form"
import styles from "../styles/AuthForm.module.css"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { registerUser, clearAuthError } from "@/features/auth/model/thunks"
import { selectLoading, selectError, selectRegistrationEmail } from "@/features/auth/model/selectors"
import { FormInput } from "../inputs/FormInput"
import { PasswordInput } from "../inputs/PasswordInput"
import { validateName, validateEmail, validatePassword } from "@/shared/lib/validation"
import { errorMessages } from "@/shared/lib/errorMessages"
import type { RegisterDto } from "@/features/auth/model/types"

interface RegistrationFormData extends Omit<RegisterDto, "role"> {
  confirmPassword: string
}

interface RegistrationFormProps {
  role: "student" | "author"
  onSuccess: (email: string) => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ role, onSuccess }) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)
  const authError = useAppSelector(selectError)
  const registrationEmail = useAppSelector(selectRegistrationEmail)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      birthday: "",
      placeWork: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const watchedFields = watch()
  const password = watch("password")

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch, watchedFields])

  useEffect(() => {
    if (registrationEmail && !loading && !authError) {
      onSuccess(registrationEmail)
    }
  }, [registrationEmail, loading, authError, onSuccess])

  const onSubmit = (data: RegistrationFormData) => {
    const { confirmPassword, ...registerData } = data
    dispatch(registerUser({ ...registerData, role }))
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
        name="placeWork"
        label="Место работы/учёбы"
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

      {authError && <p className={styles.errorMessage}>{authError}</p>}

      <Button variant="primary" type="submit" className={styles.btnCustom} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Зарегистрироваться"}
      </Button>
    </form>
  )
}

export default RegistrationForm
