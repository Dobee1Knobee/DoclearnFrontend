"use client"

import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import styles from "../styles/AuthCode.module.css"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { verifyUserEmail, clearAuthError } from "@/features/auth/model/thunks"
import { selectLoading, selectError } from "@/features/auth/model/selectors"

interface CodeFormData {
  code: string[]
}

interface CodeModalProps {
  show: boolean
  handleClose: () => void
  email: string
}

const CodeModal: React.FC<CodeModalProps> = ({ show, handleClose, email }) => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)
  const authError = useAppSelector(selectError)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CodeFormData>({
    defaultValues: {
      code: Array(6).fill(""),
    },
  })

  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const codeValues = watch("code")

  useEffect(() => {
    if (show) {
      dispatch(clearAuthError())
      reset({ code: Array(6).fill("") })
      setTimeout(() => inputsRef.current[0]?.focus(), 100)
    }
  }, [show, dispatch, reset])

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...codeValues]
    newCode[index] = value.slice(0, 1).toUpperCase()
    setValue("code", newCode)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // бэкспейс
    if (e.key === "Backspace" && !codeValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }
  // вставка 
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newCode = Array(6).fill("")

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i].toUpperCase()
    }

    setValue("code", newCode)

    const nextEmptyIndex = newCode.findIndex((val) => !val)
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5)
    inputsRef.current[focusIndex]?.focus()
  }

  const onSubmit = (data: CodeFormData) => {
    const code = data.code.join("")
    if (code.length === 6) {
      dispatch(verifyUserEmail({ email, code }))
        .unwrap()
        .then(() => handleClose())
        .catch(() => {})
    }
  }


  return (
    <Modal show={show} onHide={loading ? undefined : handleClose} centered backdrop={loading ? "static" : true}>
      <Modal.Body>
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className={styles.logoModalCode} />
          <h2 className="modal-code-title mb-4">Введите код подтверждения</h2>
          <h3 className={`${styles.modalCodeTitle} mb-4`} style={{ fontSize: 18, marginTop: -10 }}>
            Код отправлен на почту {email}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.codeInputContainer}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Controller
                  key={index}
                  name={`code.${index}` as const}
                  control={control}
                  rules={{
                    required: index === 0 ? "Введите код подтверждения" : false,
                    pattern: {
                      value: /^[A-Z0-9]$/,
                      message: "Только буквы и цифры",
                    },
                  }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      ref={(el) => {
                        inputsRef.current[index] = el
                      }}
                      type="text"
                      value={codeValues[index] || ""}
                      onChange={(e) => {
                        field.onChange(e)
                        handleCodeChange(e.target.value, index)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={styles.codeInput}
                      maxLength={1}
                      disabled={loading}
                      autoComplete="off"
                    />
                  )}
                />
              ))}
            </div>
          </form>

          {authError && <p className={styles.errorMessage}>{authError}</p>}
          {errors.code?.[0] && <p className={styles.errorMessage}>{errors.code[0].message}</p>}

          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            className={`${styles.btnCodeCustom} mt-4`}
            disabled={loading || codeValues.join("").length < 6}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Подтвердить"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CodeModal

