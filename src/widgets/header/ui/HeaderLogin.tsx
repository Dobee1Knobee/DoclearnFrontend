"use client"

import { useState } from "react"
import { Button } from "react-bootstrap"
import styles from "./Header.module.css"
import Logo from "./Logo"
import Navigation from "./Navigation"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import RegistrationModal from "@/features/auth/ui/Registration/RegistrationModal"

export default function HeaderLogin() {
  const [isLoginVisible, setIsLoginVisible] = useState(false)
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)

  const openLoginModal = () => {
    setIsLoginVisible(true)
    setIsRegisterVisible(false)
  }

  const openRegisterModal = () => {
    setIsRegisterVisible(true)
    setIsLoginVisible(false)
  }

  const closeModals = () => {
    setIsLoginVisible(false)
    setIsRegisterVisible(false)
  }

  const handleLoginSuccess = (token: string) => {
    console.log("Login successful, token:", token)
    closeModals()
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Logo />
        <Navigation />
        <Button className={styles.button} onClick={openLoginModal}> Вход </Button>

        {/* <Button
          variant="primary"
          onClick={openRegisterModal}
          style={{
            marginRight: "20px",
            width: "150px",
            height: "45px",
            fontSize: 18,
            backgroundColor: "#5388d8",
          }}
        >
          Регистрация
        </Button> */}

        <LoginModal
          show={isLoginVisible}
          handleClose={closeModals}
          switchToRegister={openRegisterModal}
          onSuccess={handleLoginSuccess}
        />

        <RegistrationModal show={isRegisterVisible} handleClose={closeModals} switchToLogin={openLoginModal} />
      </div>
    </header>
  )
}

