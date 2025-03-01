"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Button, Form, Spinner } from "react-bootstrap"
import styles from "../styles/AuthCode.module.css"


interface CodeModalProps {
  show: boolean
  handleClose: () => void
  email: string
  isAuthor: boolean
}

const CodeModal: React.FC<CodeModalProps> = ({ show, handleClose, email, isAuthor }) => {
  const [verificationCode, setVerificationCode] = useState(Array(5).fill(""))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoadingCode, setIsLoadingCode] = useState(false)

  const handleChange = (value: string, index: number) => {
    const newCode = [...verificationCode]
    newCode[index] = value.slice(0, 1)
    setVerificationCode(newCode)

    if (value && index < 4) {
      document.getElementById(`codeInput-${index + 1}`)?.focus()
    }
  }

  const handleConfirm = async () => {
    try {
      setIsLoadingCode(true)
      const data = { code: verificationCode.join("") }

      // Commented out server logic
      /*
      await authService.validateUser(data, isAuthor);
      */

      // For now, just close the modal
      handleClose()
    } catch (error) {
      setErrorMessage(error as string)
    } finally {
      setIsLoadingCode(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body>
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className={styles.logoModalCode} />

          <h2 className="modal-code-title mb-4">Введите код подтверждения</h2>
          <h3 style={{ fontSize: "18px", marginTop: "-10px" }} className={`${styles.modalCodeTitle} mb-4`}>
            Код отправлен на почту
          </h3>

          <div className={styles.codeInputContainer}>
            {verificationCode.map((value, index) => (
              <Form.Control
                key={index}
                id={`codeInput-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                className={styles.codeInput}
                maxLength={1}
              />
            ))}
          </div>

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          <Button variant="primary" onClick={handleConfirm} className={`${styles.btnCodeCustom} mt-4`}>
            {isLoadingCode ? <Spinner as="span" animation="border" size="sm" /> : "Подтвердить"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CodeModal

