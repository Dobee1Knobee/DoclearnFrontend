"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { forgotPassword } from "../../model/thunks"
import { clearError } from "../../model/slice"
import { selectIsLoading, selectError, selectEmailSent, selectSentEmail } from "../../model/selectors"
import { FormInput } from "@/features/auth/ui/inputs/FormInput"
import { validateEmail } from "@/shared/lib/validation"
import type { ForgotPasswordDto } from "../../model/types"
import styles from "@/features/auth/ui/styles/AuthForm.module.css"

interface ForgotPasswordFormProps {
  onSuccess: () => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const emailSent = useAppSelector(selectEmailSent)
  const sentEmail = useAppSelector(selectSentEmail)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  })

  const watchedEmail = watch("email")

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch, watchedEmail])

  useEffect(() => {
    if (emailSent) {
      onSuccess()
    }
  }, [emailSent, onSuccess])

  const onSubmit = (data: ForgotPasswordDto) => {
    dispatch(forgotPassword(data))
  }

  if (emailSent && sentEmail) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="text-success mb-3">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h4 className="mb-3">Письмо отправлено!</h4>
          <p className="text-muted">Мы отправили инструкции по восстановлению пароля на адрес:</p>
          <p className="fw-bold">{sentEmail}</p>
          <p className="text-muted small">Проверьте папку "Спам", если письмо не пришло в течение нескольких минут.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <div className="text-center mb-4">
        <h4>Восстановление пароля</h4>
        <p className="text-muted">
          Введите адрес электронной почты, и мы отправим вам ссылку для восстановления пароля.
        </p>
      </div>

      <FormInput
        name="email"
        label="Электронная почта"
        control={control}
        rules={{
          required: "Это поле обязательно",
          validate: validateEmail,
        }}
        error={errors.email}
        placeholder="Введите вашу почту"
        type="email"
      />

      {error && <p className={styles.errorMessage}>{error}</p>}

      <Button variant="primary" type="submit" className={styles.btnCustom} disabled={isLoading}>
        {isLoading ? <Spinner animation="border" size="sm" /> : "Отправить ссылку"}
      </Button>
    </form>
  )
}
