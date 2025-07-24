"use client"

import { useState, useEffect, useRef } from "react"
import { Button, Spinner } from "react-bootstrap"
import Image from "next/image"
import styles from "./Header.module.css"
import Logo from "./Logo"
import Navigation from "./Navigation"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import RegistrationModal from "@/features/auth/ui/Registration/RegistrationModal"
import NewRegistrationModal from "@/features/auth/ui/Registration/NewRegistrationModal"
import { ForgotPasswordModal } from "@/features/auth/passwordRecovery/ui/ForgotPasswordModal/ForgotPasswordModal"
import { UserProfileCard } from "@/entities/user/ui/UserProfileCard/UserProfileCard"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks"
import { logoutUser } from "@/features/auth/model/thunks"
import { selectIsAuthenticated, selectUser, selectLoading } from "@/features/auth/model/selectors"

export default function Header() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const isLoading = useAppSelector(selectLoading)

  const [isLoginVisible, setIsLoginVisible] = useState(false)
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)

  const profilePopupRef = useRef<HTMLDivElement>(null)

  const openLoginModal = () => {
    setIsLoginVisible(true)
    setIsRegisterVisible(false)
    setIsForgotPasswordVisible(false)
  }

  const openRegisterModal = () => {
    setIsRegisterVisible(true)
    setIsLoginVisible(false)
    setIsForgotPasswordVisible(false)
  }

  const openForgotPasswordModal = () => {
    setIsForgotPasswordVisible(true)
    setIsLoginVisible(false)
    setIsRegisterVisible(false)
  }

  const closeModals = () => {
    setIsLoginVisible(false)
    setIsRegisterVisible(false)
    setIsForgotPasswordVisible(false)
  }

  const handleLoginSuccess = () => closeModals()

  const toggleProfilePopup = () => setShowProfilePopup(!showProfilePopup)

  const closeProfilePopup = () => setShowProfilePopup(false)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    setShowProfilePopup(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target as Node)) {
        setShowProfilePopup(false)
      }
    }

    if (showProfilePopup) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfilePopup])

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Logo />
        <Navigation isAuthenticated={isAuthenticated} />

        {isLoading && !isAuthenticated ? (
          <Button className={styles.button} disabled>
            <Spinner animation="border" size="sm" />
          </Button>
        ) : isAuthenticated && user ? (
          <div className={styles.avatarContainer} ref={profilePopupRef}>
            <div className={styles.avatarWrapper} onClick={toggleProfilePopup}>
              <Image
                src={user.avatar || user.defaultAvatarPath}
                alt="User Avatar"
                width={45}
                height={45}
                className={styles.avatar}
              />
            </div>
            {showProfilePopup && (
              <div className={styles.profilePopup}>
                <UserProfileCard
                  name={`${user.lastName} ${user.firstName} ${user.middleName}`}
                  role={user.role === "student" ? "Студент" : user.role === "doctor" ? "Врач" : "Администратор"}
                  avatar={user.avatar}
                  defaultAvatarPath={user.defaultAvatarPath}
                  userId={user._id}
                  onLogout={handleLogout}
                  onClose={closeProfilePopup}
                />
              </div>
            )}
          </div>
        ) : (
          <Button className={styles.button} onClick={openLoginModal}>
            Вход
          </Button>
        )}

        <LoginModal
          show={isLoginVisible}
          handleClose={closeModals}
          switchToRegister={openRegisterModal}
          onSuccess={handleLoginSuccess}
          onForgotPassword={openForgotPasswordModal}
        />

        {/* <RegistrationModal show={isRegisterVisible} handleClose={closeModals} switchToLogin={openLoginModal} /> */}

        <NewRegistrationModal show={isRegisterVisible} handleClose={closeModals} switchToLogin={openLoginModal} />

        <ForgotPasswordModal show={isForgotPasswordVisible} handleClose={closeModals} onBackToLogin={openLoginModal} />
      </div>
    </header>
  )
}
