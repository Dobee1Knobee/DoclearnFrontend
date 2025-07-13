"use client"

import React, { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import { X } from 'lucide-react'
import { useAppDispatch } from "@/shared/hooks/hooks"
import { clearAuthError, clearRegistrationEmail } from "@/features/auth/model/slice"
import RegistrationForm from "./RegistrationForm"
import CodeModal from "./CodeModal"
import styles from "../styles/AuthModal.module.css"

interface RegistrationModalProps {
  show: boolean
  handleClose: () => void
  switchToLogin: () => void
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  show,
  handleClose,
  switchToLogin
}) => {
  const dispatch = useAppDispatch()
  const [role, setRole] = useState<"student" | "doctor">("student")
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (show) {
      dispatch(clearAuthError())
      dispatch(clearRegistrationEmail())
      setShowCodeModal(false)
      setEmail("")
      setRole("student")
    }
  }, [show, dispatch])

  const handleRegistrationSuccess = (registeredEmail: string) => {
    setEmail(registeredEmail)
    handleClose()
    setShowCodeModal(true)
  }

  const handleCodeModalClose = () => {
    dispatch(clearRegistrationEmail())
    setShowCodeModal(false)
    setEmail("")
    switchToLogin()
  }

  const handleMainModalClose = () => {
    dispatch(clearRegistrationEmail())
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
        <button 
        type="button" 
        className={styles.closeButton} 
        onClick={handleMainModalClose} 
        aria-label="Закрыть" 
      >
        <X size={20}/>
      </button>
        <Modal.Body>
          <div className="text-center">
            <img src="/logo.webp" alt="DocLearn Logo" className={styles.logo} />
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
                className={`${styles.toggleButton} ${role === "doctor" ? "active" : ""}`}
                onClick={() => setRole("doctor")}
                type="button"
                aria-pressed={role === "doctor"}
              >
                Врач
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

