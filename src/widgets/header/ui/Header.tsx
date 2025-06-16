"use client"

import React, { useState } from "react"
import { Button } from "react-bootstrap"
import Image from "next/image"
import styles from "./Header.module.css"
import Logo from "./Logo"
import Navigation from "./Navigation"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
import RegistrationModal from "@/features/auth/ui/Registration/RegistrationModal"
import { UserProfileCard } from "@/entities/user/ui/UserProfileCard/UserProfileCard"
import { useAppDispatch, useAppSelector } from "@/shared/hooks"
import { logoutUser } from "@/features/auth/model/thunks"
import { selectIsAuthenticated, selectUser, selectLoading } from "@/features/auth/model/selectors"

export default function Header() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user            = useAppSelector(selectUser);
  const isLoading       = useAppSelector(selectLoading);

  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const openLoginModal = () => {
    setIsLoginVisible(true);
    setIsRegisterVisible(false);
  };
  const openRegisterModal = () => {
    setIsRegisterVisible(true);
    setIsLoginVisible(false);
  };
  const closeModals = () => {
    setIsLoginVisible(false);
    setIsRegisterVisible(false);
  };
  const handleLoginSuccess = () => closeModals();
  const toggleProfilePopup = () => setShowProfilePopup(!showProfilePopup);
  const handleLogout = () => {
    dispatch(logoutUser());
    setShowProfilePopup(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Logo />
        <Navigation isAuthenticated={isAuthenticated} />

        {isLoading && !isAuthenticated ? (
          <Button className={styles.button} disabled>Загрузка...</Button>
        ) : isAuthenticated && user ? (
          <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper} onClick={toggleProfilePopup}>
              <Image
                src={user.avatar || "/Avatars/Avatar1.jpg"}
                alt="User Avatar"
                width={45}
                height={45}
                className={styles.avatar}
              />
            </div>
            {showProfilePopup && (
              <div className={styles.profilePopup}>
                <UserProfileCard
                  name={`${user.firstName} ${user.lastName}`}
                  role={user.role === "student" ? "Студент" : "Автор"}
                  avatar={user.avatar || "/Avatars/Avatar1.jpg"}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        ) : (
          <Button className={styles.button} onClick={openLoginModal}>Вход</Button>
        )}

        <LoginModal
          show={isLoginVisible}
          handleClose={closeModals}
          switchToRegister={openRegisterModal}
          onSuccess={handleLoginSuccess}
        />

        <RegistrationModal
          show={isRegisterVisible}
          handleClose={closeModals}
          switchToLogin={openLoginModal}
        />
      </div>
    </header>
  );
}
