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









// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Form, Button } from "react-bootstrap"
// import { IoEye, IoEyeOff } from "react-icons/io5"
// import styles from "../styles/AuthForm.module.css"


// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// const nameStartsWithUppercase = /^[A-ZА-Я]/
// const nameContainsOnlyLettersAndHyphens = /^[A-ZА-Я][a-zа-яA-ZА-Я-]*[a-zа-яA-ZА-Я]$/
// const hyphenNotConsecutive = /^[^-]*(-[^-]+)*$/
// const uppercaseRegex = /[A-Z]/

// interface RegistrationFormProps {
//   onSubmit: (name: string, surname: string, dob: string, job: string, email: string, password: string) => void
// }

// const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
//   const [name, setName] = useState("")
//   const [surname, setSurname] = useState("")
//   const [dob, setDob] = useState("")
//   const [job, setJob] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   const toggleShowPassword = () => setShowPassword(!showPassword)
//   const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     const newErrors: { [key: string]: string } = {}

//     if (!nameStartsWithUppercase.test(name)) {
//       newErrors.name = "Имя должно начинаться с заглавной буквы"
//     } else if (!nameContainsOnlyLettersAndHyphens.test(name)) {
//       newErrors.name = "Имя должно содержать только буквы и тире"
//     } else if (!hyphenNotConsecutive.test(name)) {
//       newErrors.name = "Тире не может повторяться подряд"
//     }

//     if (!nameStartsWithUppercase.test(surname)) {
//       newErrors.surname = "Фамилия должна начинаться с заглавной буквы"
//     } else if (!nameContainsOnlyLettersAndHyphens.test(surname)) {
//       newErrors.surname = "Фамилия должна содержать только буквы и тире"
//     } else if (!hyphenNotConsecutive.test(surname)) {
//       newErrors.surname = "Тире не может повторяться подряд"
//     }

//     if (!dob) {
//       newErrors.dob = "Дата рождения обязательна"
//     }

//     if (!job) {
//       newErrors.job = "Место работы обязательно"
//     }

//     if (!emailRegex.test(email)) {
//       newErrors.email = "Некорректный формат почты"
//     }

//     if (password.length < 6) {
//       newErrors.password = "Пароль должен содержать минимум 6 символов"
//     } else if (!uppercaseRegex.test(password)) {
//       newErrors.password = "Пароль должен содержать хотя бы одну заглавную букву"
//     }

//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Пароли не совпадают"
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//     } else {
//       setErrors({})
//       onSubmit(name, surname, dob, job, email, password)
//     }
//   }

//   return (
//     <Form onSubmit={handleSubmit} noValidate>
//       <Form.Group controlId="formName">
//         <Form.Label className={styles.formLabel}>Имя</Form.Label>
//         <Form.Control
//           className={styles.customInput}
//           type="text"
//           placeholder="Введите ваше имя"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           isInvalid={!!errors.name}
//           required
//         />
//         <Form.Control.Feedback type="invalid" style={{ marginBottom: "10px", marginTop: "-10px" }}>
//           {errors.name}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group controlId="formSurname">
//         <Form.Label className={styles.formLabel}>Фамилия</Form.Label>
//         <Form.Control
//           className={styles.customInput}
//           type="text"
//           placeholder="Введите вашу фамилию"
//           value={surname}
//           onChange={(e) => setSurname(e.target.value)}
//           isInvalid={!!errors.surname}
//           required
//         />
//         <Form.Control.Feedback type="invalid" style={{ marginBottom: "10px", marginTop: "-10px" }}>
//           {errors.surname}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group controlId="formDob">
//         <Form.Label className={styles.formLabel}>Дата рождения</Form.Label>
//         <Form.Control
//           className={`${styles.customInput} ${styles.dateInput}`}
//           type="date"
//           value={dob}
//           onChange={(e) => setDob(e.target.value)}
//           isInvalid={!!errors.dob}
//           required
//         />
//         <Form.Control.Feedback type="invalid" style={{ marginBottom: "10px", marginTop: "-10px" }}>
//           {errors.dob}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group controlId="formJob">
//         <Form.Label className={styles.formLabel}>Место работы/учёбы</Form.Label>
//         <Form.Control
//           className={styles.customInput}
//           type="text"
//           placeholder="Введите место вашей работы/учёбы"
//           value={job}
//           onChange={(e) => setJob(e.target.value)}
//           isInvalid={!!errors.job}
//           required
//         />
//         <Form.Control.Feedback type="invalid" style={{ marginBottom: "10px", marginTop: "-10px" }}>
//           {errors.job}
//         </Form.Control.Feedback>
//       </Form.Group>

//       <Form.Group controlId="formEmail">
//         <Form.Label className={styles.formLabel}>Почта</Form.Label>
//         <Form.Control
//           className={styles.customInput}
//           type="email"
//           placeholder="Введите вашу почту"
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
//           <Form.Control.Feedback type="invalid" style={{ display: "block", marginBottom: "10px", marginTop: "-10px" }}>
//             {errors.password}
//           </Form.Control.Feedback>
//         </div>
//       </Form.Group>

//       <Form.Group controlId="formConfirmPassword">
//         <Form.Label className={styles.formLabel}>Повторите пароль</Form.Label>
//         <div className={styles.passwordWrapper} style={{ position: "relative" }}>
//           <Form.Control
//             className={styles.customInput}
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="Повторите пароль"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             isInvalid={!!errors.confirmPassword}
//             required
//           />
//           <span
//             className={styles.passwordToggleIcon}
//             onClick={toggleShowConfirmPassword}
//             style={{
//               position: "absolute",
//               right: errors.confirmPassword ? "35px" : "10px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               cursor: "pointer",
//             }}
//           >
//             {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
//           </span>
//         </div>
//         <div>
//           <Form.Control.Feedback type="invalid" style={{ display: "block", marginTop: "-10px" }}>
//             {errors.confirmPassword}
//           </Form.Control.Feedback>
//         </div>
//       </Form.Group>

//       <Button variant="primary" type="submit" className={styles.btnCustom}>
//         Зарегистрироваться
//       </Button>
//     </Form>
//   )
// }

// export default RegistrationForm
