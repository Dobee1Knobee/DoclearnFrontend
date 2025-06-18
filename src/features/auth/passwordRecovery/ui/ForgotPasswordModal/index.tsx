"use client"

import { useEffect } from "react"
import { Modal } from "react-bootstrap"
import { useAppDispatch } from "@/shared/hooks"
import { resetState } from "../../model/slice"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import styles from "@/features/auth/ui/styles/AuthModal.module.css"

interface ForgotPasswordModalProps {
  show: boolean
  handleClose: () => void
  onBackToLogin: () => void
}

export function ForgotPasswordModal({ show, handleClose, onBackToLogin }: ForgotPasswordModalProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (show) {
      dispatch(resetState())
    }
  }, [show, dispatch])

  const handleSuccess = () => {
    // Модальное окно остается открытым, показывая сообщение об успехе
  }

  const handleModalClose = () => {
    dispatch(resetState())
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleModalClose} centered className={styles.customModal} backdrop="static">
      <Modal.Body>
        <div className="text-center">
          <img src="/logo.png" alt="DocLearn Logo" className={styles.logo} />
        </div>
        <ForgotPasswordForm onSuccess={handleSuccess} />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleModalClose()
            onBackToLogin()
          }}
          className={styles.loginLink}
        >
          Вернуться к входу
        </a>
      </Modal.Footer>
    </Modal>
  )
}
