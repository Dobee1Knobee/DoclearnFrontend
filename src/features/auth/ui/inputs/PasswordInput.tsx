"use client"

import type React from "react"
import { useState } from "react"
import { Form } from "react-bootstrap"
import { Controller, type Control, type FieldError } from "react-hook-form"
import { IoEye, IoEyeOff } from "react-icons/io5"
import styles from "..//styles/AuthForm.module.css"

interface PasswordInputProps {
  name: string
  label: string
  control: Control<any>
  rules: object
  error?: FieldError
  placeholder?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ name, label, control, rules, error, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => setShowPassword(!showPassword)

  return (
    <Form.Group controlId={`form${name}`}>
      <Form.Label className={styles.formLabel}>{label}</Form.Label>
      <div className={styles.passwordWrapper}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Form.Control
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              className={styles.customInput}
              isInvalid={!!error}
            />
          )}
        />
        <span className={`${styles.passwordToggleIcon} ${error ? styles.hasError : ''}`} onClick={toggleShowPassword}>
          {showPassword ? <IoEyeOff /> : <IoEye />}
        </span>
      </div>
      <Form.Control.Feedback type="invalid" className={styles.feedbackInvalid}>
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

