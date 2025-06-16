"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import RegistrationForm from "./RegistrationForm"
import CodeModal from "./CodeModal"
import styles from "../styles/AuthModal.module.css"

interface RegistrationModalProps {
  show: boolean
  handleClose: () => void
  switchToLogin: () => void
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ show, handleClose, switchToLogin }) => {
  const [role, setRole] = useState<"student" | "author">("student")
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (show) {
      setShowCodeModal(false)
      setEmail("")
      setRole("student")
    }
  }, [show])

  const handleRegistrationSuccess = (registeredEmail: string) => {
    setEmail(registeredEmail)
    handleClose()
    setShowCodeModal(true)
  }

  const handleCodeModalClose = () => {
    setShowCodeModal(false)
    setEmail("") 
    switchToLogin()
  }

  const handleMainModalClose = () => {
    setShowCodeModal(false)
    setEmail("")
    handleClose()
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleMainModalClose} 
        centered
        className={styles.customModal}
        backdrop="static"
      >
        <Modal.Body>
          <div className="text-center">
            <img src="/logo.png" alt="DocLearn Logo" className={styles.logo} />
            <h2 className={styles.modalTitle}>Регистрация</h2>
            <div className={styles.roleToggle} role="group" aria-label="Выбор роли">
              <button
                className={`${styles.toggleButton} ${role === "student" ? "active" : ""}`}
                onClick={() => setRole("student")}
                type="button"
                aria-pressed={role === "student"}
              >
                Студент
              </button>
              <button
                className={`${styles.toggleButton} ${role === "author" ? "active" : ""}`}
                onClick={() => setRole("author")}
                type="button"
                aria-pressed={role === "author"}
              >
                Автор
              </button>
            </div>
          </div>

          <RegistrationForm role={role} onSuccess={handleRegistrationSuccess} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleMainModalClose() 
              switchToLogin()
            }}
            className={styles.loginLink}
          >
            Уже есть аккаунт? Войти
          </a>
        </Modal.Footer>
      </Modal>

      <CodeModal show={showCodeModal} handleClose={handleCodeModalClose} email={email} />
    </>
  )
}

export default RegistrationModal

