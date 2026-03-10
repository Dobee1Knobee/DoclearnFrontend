"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import { X } from "lucide-react"
import { FaUserDoctor, FaHospital } from "react-icons/fa6"
import { useAppDispatch } from "@/shared/hooks/hooks"
import { clearAuthError, clearRegistrationEmail } from "@/features/auth/model/slice"
import SpecialistRegistrationForm from "./SpecialistRegistrationForm"
import OrganizationRegistrationForm from "./OrganizationRegistrationForm"
import CodeModal from "./CodeModal"
import styles from "../styles/AuthModal.module.css"
import Image from "next/image"
import type { AccountType } from "@/features/auth/model/types"

interface NewRegistrationModalProps {
  show: boolean
  handleClose: () => void
  switchToLogin: () => void
}

const NewRegistrationModal: React.FC<NewRegistrationModalProps> = ({ show, handleClose, switchToLogin }) => {
  const dispatch = useAppDispatch()
  const [accountType, setAccountType] = useState<AccountType>("specialist")
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (show) {
      dispatch(clearAuthError())
      dispatch(clearRegistrationEmail())
      setShowCodeModal(false)
      setEmail("")
      setAccountType("specialist")
    }
  }, [show, dispatch])

  const handleSpecialistRegistrationSuccess = (registeredEmail: string) => {
    setEmail(registeredEmail)
    handleClose()
    setShowCodeModal(true)
  }

  const handleOrganizationRegistrationSuccess = () => {
    handleMainModalClose()
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
        className={`${styles.customModal} ${styles.registrationModal}`}
        dialogClassName={styles.registrationDialog}
        backdrop="static"
      >
        <button type="button" className={styles.closeButton} onClick={handleMainModalClose} aria-label="Закрыть">
          <X size={20} />
        </button>
        <Modal.Body>
          <div className="text-center">
            <Image src="/logo.webp" alt="DocLearn Logo" className={styles.logo} width={200} height={100} />
            <h2 className={styles.modalTitle}>Регистрация</h2>
            <p className={styles.modalSubtitle}>Создайте аккаунт и получите доступ к материалам, анонсам и сообществу.</p>
            <div className={styles.roleToggle} role="group" aria-label="Выбор типа аккаунта">
              <button
                className={`${styles.toggleButton} ${accountType === "specialist" ? "active" : ""}`}
                onClick={() => setAccountType("specialist")}
                type="button"
                aria-pressed={accountType === "specialist"}
              >
                <span className={styles.toggleContent}>
                  <FaUserDoctor size={20} />
                  <span className={styles.toggleLabel}>Специалист</span>
                </span>
              </button>
              <button
                className={`${styles.toggleButton} ${accountType === "organization" ? "active" : ""}`}
                onClick={() => setAccountType("organization")}
                type="button"
                aria-pressed={accountType === "organization"}
              >
                <span className={styles.toggleContent}>
                  <FaHospital size={20} />
                  <span className={styles.toggleLabel}>Организация</span>
                </span>
              </button>
            </div>
          </div>

          {accountType === "specialist" ? (
            <SpecialistRegistrationForm onSuccess={handleSpecialistRegistrationSuccess} />
          ) : (
            <OrganizationRegistrationForm onSuccess={handleOrganizationRegistrationSuccess} />
          )}
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

export default NewRegistrationModal
