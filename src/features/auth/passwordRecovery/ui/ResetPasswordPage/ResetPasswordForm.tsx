"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button, Spinner, Alert } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { resetPassword } from "../../model/thunks"
import { clearError } from "../../model/slice"
import { selectIsLoading, selectError, selectPasswordReset } from "../../model/selectors"
import { PasswordInput } from "@/features/auth/ui/inputs/PasswordInput"
import { validatePassword } from "@/shared/lib/validation"
import { errorMessages } from "@/shared/lib/errorMessages"
import type { ResetPasswordDto } from "../../model/types"
import styles from "@/features/auth/ui/styles/AuthForm.module.css"

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const passwordReset = useAppSelector(selectPasswordReset)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const watchedFields = watch()
  const newPassword = watch("newPassword")

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch, watchedFields.newPassword, watchedFields.confirmPassword])

  useEffect(() => {
    if (passwordReset) {
      setTimeout(() => {
        router.push("/")
      }, 3000)
    }
  }, [passwordReset, router])

  const onSubmit = (data: ResetPasswordFormData) => {
    const resetData: ResetPasswordDto = {
      token,
      newPassword: data.newPassword,
    }
    dispatch(resetPassword(resetData))
  }

  if (passwordReset) {
    return (
      <div className="text-center mx-auto" style={{ maxWidth: "500px", marginTop: "8rem" }}>
        <Alert variant="success" className="mb-4">
          <div className="text-success mb-3">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h4 className="mb-3">Пароль успешно изменён!</h4>
          <p>Ваш пароль был успешно обновлён. Вы будете перенаправлены на главную страницу через несколько секунд.</p>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "8rem", marginBottom: "8rem" }}>
      <div className="card">
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img src="/logo.png" alt="DocLearn Logo" style={{ width: "200px", marginBottom: "2rem" }} />
            <h2>Создание нового пароля</h2>
            <p className="text-muted">Введите новый пароль для вашего аккаунта</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
            <PasswordInput
              name="newPassword"
              label="Новый пароль"
              control={control}
              rules={{
                required: errorMessages.required,
                validate: validatePassword,
              }}
              error={errors.newPassword}
              placeholder="Введите новый пароль"
            />

            <PasswordInput
              name="confirmPassword"
              label="Подтвердите пароль"
              control={control}
              rules={{
                required: errorMessages.required,
                validate: (value: string) => {
                  if (value !== newPassword) {
                    return errorMessages.passwordMismatch
                  }
                  return true
                },
              }}
              error={errors.confirmPassword}
              placeholder="Повторите новый пароль"
            />

            {error && <p className={styles.errorMessage}>{error}</p>}

            <Button variant="primary" type="submit" className={styles.btnCustom} disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Изменить пароль"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <a href="/" className="text-decoration-none" style={{ color: "#5388d8" }}>
              Вернуться на главную страницу
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
