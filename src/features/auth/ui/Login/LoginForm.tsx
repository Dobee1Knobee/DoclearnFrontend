"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, Button, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { loginUser, clearAuthError } from "@/features/auth/model/thunks"
import { selectLoading, selectError, selectIsAuthenticated, selectUser } from "@/features/auth/model/selectors"
import { IoEye, IoEyeOff } from "react-icons/io5"
import { FormInput } from "../inputs/FormInput"
import { PasswordInput } from "../inputs/PasswordInput"
import { validateEmail , validatePassword } from "@/shared/lib/validation"
import type { LoginDto } from "@/features/auth/model/types"
import styles from "../styles/AuthForm.module.css"


interface LoginFormProps {
  onSuccess: (userId: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const authError = useAppSelector(selectError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

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
        <a href="#" className={styles.forgotPassword}>
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





// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Form, Button, Spinner } from "react-bootstrap"
// import { IoEye, IoEyeOff } from "react-icons/io5"
// import styles from "../styles/AuthForm.module.css"


// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// const uppercaseRegex = /[A-Z]/

// interface LoginFormProps {
//   onSuccess: (token: string) => void
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
//   const [errorMessage, setErrorMessage] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const toggleShowPassword = () => setShowPassword(!showPassword)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const newErrors: { email?: string; password?: string } = {}

//     if (!emailRegex.test(email)) {
//       newErrors.email = "Некорректный формат почты"
//     }

//     if (password.length < 6) {
//       newErrors.password = "Пароль должен содержать минимум 6 символов"
//     } else if (!uppercaseRegex.test(password)) {
//       newErrors.password = "Пароль должен содержать хотя бы одну заглавную букву"
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }

//     setErrors({})
//     setIsLoading(true)

//     try {
//       // Commented out server logic
//       /*
//             const { token, role } = await authService.login({ email, password });
//             console.log("Токен:", token, "Роль:", role);
//             setErrorMessage(null);
//             onSuccess(token);
//             */

//       // For now, just simulate a successful login
//       setTimeout(() => {
//         setErrorMessage(null)
//         onSuccess("dummy_token")
//       }, 1000)
//     } catch (error: any) {
//       console.error("Ошибка авторизации:", error)
//       setErrorMessage("Неверные данные для входа. Проверьте email или пароль.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Form onSubmit={handleSubmit} noValidate>
//       <Form.Group controlId="formEmail">
//         <Form.Label className={styles.formLabel}>Почта</Form.Label>
//         <Form.Control
//           className={styles.customInput}
//           type="email"
//           placeholder="Введите свою почту"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           isInvalid={!!errors.email}
//           required
//         />
//         <Form.Control.Feedback type="invalid" style={{ marginBottom: "10px", marginTop: "-10px" }}>
//           {errors.email}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group controlId="formPassword">
//         <Form.Label className={styles.formLabel}>Пароль</Form.Label>
//         <div className={styles.passwordWrapper} style={{ position: "relative" }}>
//           <Form.Control
//             className={styles.customInput}
//             type={showPassword ? "text" : "password"}
//             placeholder="Введите пароль"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             isInvalid={!!errors.password}
//             required
//           />
//           <span
//             className={styles.passwordToggleIcon}
//             onClick={toggleShowPassword}
//             style={{
//               position: "absolute",
//               right: errors.password ? "35px" : "10px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               cursor: "pointer",
//             }}
//           >
//             {showPassword ? <IoEyeOff /> : <IoEye />}
//           </span>
//         </div>
//         <div>
//           <Form.Control.Feedback type="invalid" style={{ display: "block", marginTop: "-10px" }}>
//             {errors.password}
//           </Form.Control.Feedback>
//         </div>
//       </Form.Group>

//       {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <a href="#" className={styles.forgotPassword}>
//           Забыли пароль?
//         </a>
//       </div>

//       <Button variant="primary" type="submit" className={styles.btnCustom} disabled={isLoading}>
//         {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "Войти"}
//       </Button>
//     </Form>
//   )
// }

// export default LoginForm

