"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { Form, Button } from "react-bootstrap"
import styles from "../styles/AuthForm.module.css"
import { validateName, validateEmail, validatePassword } from "@/shared/lib/validation"
import { FormInput } from "@/features/auth/ui/inputs/FormInput"
import { PasswordInput } from "@/features/auth/ui/inputs/PasswordInput"
import { errorMessages } from "@/shared/lib/errorMessages"

interface RegistrationFormData {
  name: string
  surname: string
  dob: string
  job: string
  email: string
  password: string
  confirmPassword: string
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>()

  const password = watch("password")

  const onSubmitForm = (data: RegistrationFormData) => {
    onSubmit(data)
  }

  return (
    <Form onSubmit={handleSubmit(onSubmitForm)} noValidate>
      <FormInput
        name="name"
        label="Имя"
        control={control}
        rules={{ validate: validateName }}
        error={errors.name}
        placeholder="Введите ваше имя"
      />

      <FormInput
        name="surname"
        label="Фамилия"
        control={control}
        rules={{ validate: validateName }}
        error={errors.surname}
        placeholder="Введите вашу фамилию"
      />

      <FormInput
        name="dob"
        label="Дата рождения"
        control={control}
        rules={{ required: errorMessages.required }}
        error={errors.dob}
        type="date"
      />

      <FormInput
        name="job"
        label="Место работы/учёбы"
        control={control}
        rules={{ required: errorMessages.required }}
        error={errors.job}
        placeholder="Введите место вашей работы/учёбы"
      />

      <FormInput
        name="email"
        label="Почта"
        control={control}
        rules={{ validate: validateEmail }}
        error={errors.email}
        placeholder="Введите вашу почту"
        type="email"
      />

      <PasswordInput
        name="password"
        label="Пароль"
        control={control}
        rules={{ validate: validatePassword }}
        error={errors.password}
        placeholder="Введите пароль"
      />

      <PasswordInput
        name="confirmPassword"
        label="Повторите пароль"
        control={control}
        rules={{
          validate: (value: string) => value === password || errorMessages.passwordMismatch,
        }}
        error={errors.confirmPassword}
        placeholder="Повторите пароль"
      />

      <Button variant="primary" type="submit" className={styles.btnCustom}>
        Зарегистрироваться
      </Button>
    </Form>
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
