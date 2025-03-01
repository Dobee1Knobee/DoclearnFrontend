"use client"

import type React from "react"
import { useState } from "react"
import { Modal } from "react-bootstrap"
import RegistrationForm from "./RegistrationForm"
import CodeModal from "./CodeModal"
import styles from "../styles/AuthModal.module.css"

interface RegistrationFormData {
  name: string
  surname: string
  dob: string
  job: string
  email: string
  password: string
}

interface RegistrationModalProps {
  show: boolean
  handleClose: () => void
  switchToLogin: () => void
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ show, handleClose, switchToLogin }) => {
  const [role, setRole] = useState("Студент")
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleRegisterSubmit = async (data: RegistrationFormData) => {
    const { name, surname, dob, job, email, password } = data
    setEmail(email)
    setErrorMessage(null)
    handleClose()
    setShowCodeModal(true)
  }

  const handleCodeModalClose = () => {
    setShowCodeModal(false)
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={styles.customModal}
        backdrop={true}
        aria-labelledby="registration-modal-title"
      >
        <Modal.Body>
          <div className="text-center">
            <img src="/logo.png" alt="DocLearn Logo" className={styles.logo} />
            <h2 id="registration-modal-title" className={styles.modalTitle}>
              Регистрация
            </h2>

            <div className={styles.roleToggle} role="group" aria-label="Выбор роли">
              <button
                className={`${styles.toggleButton} ${role === "Студент" ? "active" : ""}`}
                onClick={() => setRole("Студент")}
                type="button"
                aria-pressed={role === "Студент"}
              >
                Студент
              </button>
              <button
                className={`${styles.toggleButton} ${role === "Автор" ? "active" : ""}`}
                onClick={() => setRole("Автор")}
                type="button"
                aria-pressed={role === "Автор"}
              >
                Автор
              </button>
            </div>
          </div>

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          <RegistrationForm onSubmit={handleRegisterSubmit} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleClose()
              switchToLogin()
            }}
            className={styles.loginLink}
            role="button"
            aria-label="Переключиться на форму входа"
          >
            Уже есть аккаунт? Войти
          </a>
        </Modal.Footer>
      </Modal>

      <CodeModal show={showCodeModal} handleClose={handleCodeModalClose} email={email} isAuthor={role === "Автор"} />
    </>
  )
}

export default RegistrationModal

