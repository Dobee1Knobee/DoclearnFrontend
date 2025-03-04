"use client"

import { useState } from "react"
import { Button } from "react-bootstrap"
import Image from "next/image"
import styles from "./Header.module.css"
import Logo from "./Logo"
import Navigation from "./Navigation"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import RegistrationModal from "@/features/auth/ui/Registration/RegistrationModal"
import { UserProfileCard } from "@/entities/user/ui/UserProfileCard/UserProfileCard"

export default function Header() {
  const [isLoginVisible, setIsLoginVisible] = useState(false)
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)

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
    setIsAuthenticated(true)
  }

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowProfilePopup(false)
  }


  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Logo />
        <Navigation />

        {isAuthenticated ? (
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper} onClick={toggleProfilePopup}>
              <Image
                src="/Avatars/Avatar1.jpg"
                alt="User Avatar"
                width={45}
                height={45}
                className={styles.avatar}
              />
            </div>
            {showProfilePopup && (
              <div className={styles.profilePopup}>
                <UserProfileCard name="Артем Кузин" role="Студент" onLogout={handleLogout} />
              </div>
            )}
          </div>
        ) : (
          <Button className={styles.button} onClick={openLoginModal}>
            Вход
          </Button>
        )}

        {/* <Button className={styles.button} onClick={openLoginModal}> Вход </Button> */}

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

