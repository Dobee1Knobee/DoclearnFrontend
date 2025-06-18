"use client"

import type React from "react"
import { Modal } from "react-bootstrap"
import LoginForm from "./LoginForm"
import styles from "../styles/AuthModal.module.css"

interface LoginModalProps {
  show: boolean
  handleClose: () => void
  switchToRegister: () => void
  onSuccess: (userId: string) => void
  onForgotPassword?: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({
  show,
  handleClose,
  switchToRegister,
  onSuccess,
  onForgotPassword,
}) => (
  <Modal
    show={show}
    onHide={handleClose}
    centered
    className={styles.customModal}
    backdrop="static"
  >
    <Modal.Body>
      <div className="text-center">
        <img src="/logo.png" alt="DocLearn Logo" className={styles.logo} />
        <h2 className={styles.modalTitle}>Войти</h2>
      </div>
      <LoginForm onSuccess={onSuccess} onForgotPassword={onForgotPassword} />
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-center">
      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          handleClose()
          switchToRegister()
        }}
        className={styles.registrationLink}
      >
        Нет аккаунта? Зарегистрируйся
      </a>
    </Modal.Footer>
  </Modal>
);

export default LoginModal
