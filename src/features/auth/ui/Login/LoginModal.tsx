"use client"

import type React from "react"
import { Modal } from "react-bootstrap"
import LoginForm from "./LoginForm"
import styles from "../styles/AuthModal.module.css"

interface LoginModalProps {
  show: boolean
  handleClose: () => void
  switchToRegister: () => void
  onSuccess: (token: string) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ show, handleClose, switchToRegister, onSuccess }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={styles.customModal}
      backdrop={true}
      aria-labelledby="login-modal-title"
    >
      <Modal.Body>
        <div className="text-center">
          <img src="/logo.png" alt="DocLearn Logo" className={styles.logo} />
          <h2 id="login-modal-title" className={styles.modalTitle}>
            Войти
          </h2>
        </div>

        <LoginForm onSuccess={onSuccess} />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleClose()
            switchToRegister()
          }}
          className={styles.registrationLink}
          role="button"
          aria-label="Переключиться на форму регистрации"
        >
          Нет аккаунта? Зарегистрируйся
        </a>
      </Modal.Footer>
    </Modal>
  )
}

export default LoginModal

