import type React from "react"
import { Form } from "react-bootstrap"
import { Controller, type Control, type FieldError } from "react-hook-form"
import styles from "../styles/AuthForm.module.css"

interface FormInputProps {
  name: string
  label: string
  control: Control<any>
  rules: object
  error?: FieldError
  placeholder?: string
  type?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  control,
  rules,
  error,
  placeholder,
  type = "text",
}) => {
  return (
    <Form.Group controlId={`form${name}`}>
      <Form.Label className={styles.formLabel}>{label}</Form.Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Form.Control
            {...field}
            type={type}
            placeholder={placeholder}
            className={styles.customInput}
            isInvalid={!!error}
          />
        )}
      />
      <Form.Control.Feedback type="invalid" className={styles.feedbackInvalid}>
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  )
}

