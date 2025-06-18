"use client"

import type React from "react"
import { useEffect} from "react"
import { useForm } from "react-hook-form"
import { Button, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { loginUser, clearAuthError } from "@/features/auth/model/thunks"
import { selectLoading, selectError, selectIsAuthenticated, selectUser } from "@/features/auth/model/selectors"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { FormInput } from "../inputs/FormInput"
import { PasswordInput } from "../inputs/PasswordInput"
import { validateEmail, validatePassword } from "@/shared/lib/validation"
import type { LoginDto } from "@/features/auth/model/types"
import styles from "../styles/AuthForm.module.css"


interface LoginFormProps {
  onSuccess: (userId: string) => void
  onForgotPassword?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)
  const authError = useAppSelector(selectError)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)


  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginDto>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const watchedFields = watch()

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch, watchedFields.email, watchedFields.password])

  useEffect(() => {
    if (isAuthenticated && user) {
      onSuccess(user._id)
    }
  }, [isAuthenticated, user, onSuccess])

  const onSubmit = (data: LoginDto) => {
    dispatch(loginUser(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
      <FormInput
        name="email"
        label="Почта"
        control={control}
        rules={{
          required: "Это поле обязательно",
          validate: validateEmail,
        }}
        error={errors.email}
        placeholder="Введите свою почту"
        type="email"
      />

      <PasswordInput
        name="password"
        label="Пароль"
        control={control}
        rules={{
          required: "Это поле обязательно",
          validate: validatePassword,
        }}
        error={errors.password}
        placeholder="Введите пароль"
      />

      {authError && <p className={styles.errorMessage}>{authError}</p>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <a 
          href="#" 
          className={styles.forgotPassword}
          onClick={(e) => {
            e.preventDefault()
            onForgotPassword?.()
          }}
        >
          Забыли пароль?
        </a>
      </div>

      <Button variant="primary" type="submit" className={styles.btnCustom} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Войти"}
      </Button>
    </form>
  )
}

export default LoginForm