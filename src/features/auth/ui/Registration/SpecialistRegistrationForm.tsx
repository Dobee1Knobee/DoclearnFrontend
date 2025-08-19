"use client"

import type React from "react"
import { useEffect } from "react"
import { Button, Spinner, Form } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import styles from "../styles/AuthForm.module.css"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks"
import { registerUser } from "@/features/auth/model/thunks"
import { clearAuthError } from "@/features/auth/model/slice"
import { selectLoading, selectError, selectRegistrationEmail } from "@/features/auth/model/selectors"
import { FormInput } from "../inputs/FormInput"
import { PasswordInput } from "../inputs/PasswordInput"
import { validateName, validateOptionalName, validateEmail, validatePassword } from "@/shared/lib/validation"
import { errorMessages } from "@/shared/lib/errorMessages"
import type { RegisterSpecialistDto } from "@/features/auth/model/types"

interface SpecialistRegistrationFormData extends Omit<RegisterSpecialistDto, "defaultAvatarPath" | "accountType"> {
  confirmPassword: string
  agreeToTerms: boolean
}

interface SpecialistRegistrationFormProps {
  onSuccess: (email: string) => void
}

const SpecialistRegistrationForm: React.FC<SpecialistRegistrationFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)
  const authError = useAppSelector(selectError)
  const registrationEmail = useAppSelector(selectRegistrationEmail)

  const {
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
      agreeToTerms: false,
    },
  })

  const password = watch("password")

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (registrationEmail && !loading && !authError) {
      onSuccess(registrationEmail)
    }
  }, [registrationEmail, loading, authError, onSuccess])

  const onSubmit = (data: SpecialistRegistrationFormData) => {
    const { confirmPassword, agreeToTerms, ...registerData } = data
    const formattedData: RegisterSpecialistDto = {
      ...registerData,
      role: "student",
      defaultAvatarPath: "/Avatars/Avatar1.webp",
    }
    console.log(">> Specialist Registration payload:", {
      formattedData,
    })
    dispatch(registerUser(formattedData))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
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
        label="Место работы (необязательно)"
        control={control}
        rules={{}}
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

      <Controller
        name="agreeToTerms"
        control={control}
        rules={{ required: "Для отправки формы необходимо Ваше согласие" }}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <>
            <Form.Check
              id="agreeToTerms"
              type="checkbox"
              name={name}
              ref={ref}
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              isInvalid={!!errors.agreeToTerms}
              label={
                <>
                  Я&nbsp;согласен&nbsp;с&nbsp;условиями{" "}
                  <a href="/user-agreement" target="_blank" rel="noopener noreferrer">
                    Пользовательского&nbsp;соглашения
                  </a>{" "}
                  и&nbsp;
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Политики&nbsp;конфиденциальности
                  </a>
                </>
              }
              feedback={errors.agreeToTerms?.message}
              className="mt-4 mb-2"
            >

            </Form.Check>
            {errors.agreeToTerms && (
              <Form.Control.Feedback type="invalid" className="d-block mb-3">
                {errors.agreeToTerms.message}
              </Form.Control.Feedback>
            )}
          </>
        )}
      />

      {authError && <p className={styles.errorMessage}>{authError}</p>}

      <Button variant="primary" type="submit" className={styles.btnCustom} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Зарегистрироваться"}
      </Button>
    </form>
  )
}

export default SpecialistRegistrationForm
