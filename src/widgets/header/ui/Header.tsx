"use client"

import { useState, useEffect, useRef } from "react"
import { Button, Spinner } from "react-bootstrap"
import Image from "next/image"
import { Search, X } from "lucide-react"
import styles from "./Header.module.css"
import Logo from "./Logo"
import Navigation from "./Navigation"
import LoginModal from "@/features/auth/ui/Login/LoginModal"
// import RegistrationModal from "@/features/auth/ui/Registration/RegistrationModal"
import NewRegistrationModal from "@/features/auth/ui/Registration/NewRegistrationModal"
import { ForgotPasswordModal } from "@/features/auth/passwordRecovery/ui/ForgotPasswordModal/ForgotPasswordModal"
import { UserProfileCard } from "@/entities/user/ui/UserProfileCard/UserProfileCard"
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks"
import { logoutUser } from "@/features/auth/model/thunks"
import { selectIsAuthenticated, selectUser, selectLoading } from "@/features/auth/model/selectors"
import { useSearch } from "@/features/search/hooks/useSearch"
import { SearchInput } from "@/features/search/ui/SearchInput"
import { SearchDropdown } from "@/features/search/ui/SearchDropdown"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import desktopLogo from "@/../../public/logo.webp"
import mobileLogo from "@/../../public/mobileLogo1.png"
import Link from "next/link"

export default function Header() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const isLoading = useAppSelector(selectLoading)
  const { getAvatarUrl } = useAvatarCache()

  const [isLoginVisible, setIsLoginVisible] = useState(false)
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const profilePopupRef = useRef<HTMLDivElement>(null)
  const desktopSearchRef = useRef<HTMLDivElement>(null)

  const {
    query,
    results,
    totalCount,
    isLoading: searchLoading,
    error: searchError,
    selectedIndex,
    isOpen: searchOpen,
    setQuery,
    selectResult,
    closeSearch,
    clearSearch,
    handleKeyDown,
  } = useSearch()

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

  const openMobileSearch = () => setShowMobileSearch(true)
  const closeMobileSearch = () => {
    setShowMobileSearch(false)
    clearSearch()
  }

  const handleMobileSearchClose = () => {
    closeMobileSearch()
  }

  const avatarUrl = user ? getAvatarUrl(user.avatarUrl, user.avatarId, user._id, user.defaultAvatarPath) : "/placeholder.webp"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target as Node)) {
        setShowProfilePopup(false)
      }

      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        closeSearch()
      }

      const searchOverlay = document.querySelector(`.${styles.mobileSearchOverlay}`)
      if (showMobileSearch && searchOverlay && !searchOverlay.contains(event.target as Node)) {
        closeMobileSearch()
        // setShowMobileSearch(false)
      }
    }

    if (showProfilePopup || searchOpen || showMobileSearch) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfilePopup, searchOpen, showMobileSearch, closeSearch])

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.desktopLogo}>
          <Logo />
        </div>

        <div className={styles.mobileSearchIcon}>
          <Search className={styles.searchIcon} onClick={openMobileSearch} />
        </div>

        <div className={styles.search} ref={desktopSearchRef}>
          <div className={styles.searchContainer}>
            <SearchInput
              value={query}
              onChange={setQuery}
              onKeyDown={handleKeyDown}
              placeholder="Поиск пользователей..."
              className={styles.searchInput}
            />
            <SearchDropdown
              isOpen={searchOpen}
              results={results}
              totalCount={totalCount}
              isLoading={searchLoading}
              error={searchError}
              selectedIndex={selectedIndex}
              onSelectResult={selectResult}
              onClose={closeSearch}
            />
          </div>
          <Navigation isAuthenticated={isAuthenticated} />
        </div>

        <div className={styles.mobileCenter}>
            <Link
              href="/"
              aria-label="На главную"
              className={styles.mobileLogo}
              prefetch
            >
              <Image
                src={mobileLogo || "/placeholder.webp"}
                alt="Logo"
                width={200}
                height={60}
                priority
                quality={100}
                style={{
                  objectFit: "contain",
                  height: "auto",
                }}
              />
            </Link>
          {/* <div className={styles.mobileNavigation}>
            <Navigation isAuthenticated={isAuthenticated} isMobile={true} />
          </div> */}
        </div>

        {showMobileSearch && (
          <div className={styles.mobileSearchOverlay}>
            <div className={styles.mobileSearchContainer}>
              <div className={styles.mobileSearchInputContainer}>
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  onKeyDown={handleKeyDown}
                  placeholder="Поиск пользователей..."
                  className={styles.mobileSearchInput}
                  autoFocus
                />
                <button className={styles.mobileSearchClose} onClick={handleMobileSearchClose} type="button">
                  <X size={20} />
                </button>
              </div>
              <SearchDropdown
                isOpen={searchOpen || query.length >= 3}
                results={results}
                totalCount={totalCount}
                isLoading={searchLoading}
                error={searchError}
                selectedIndex={selectedIndex}
                onSelectResult={(user) => {
                  selectResult(user)
                  closeMobileSearch()
                }}
                onClose={closeSearch}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {isLoading && !isAuthenticated ? (
          <Button className={styles.button} disabled>
            <Spinner animation="border" size="sm" />
          </Button>
        ) : isAuthenticated && user ? (
          <div className={styles.avatarContainer} ref={profilePopupRef}>
            <div className={styles.avatarWrapper} onClick={toggleProfilePopup}>
              <Image
                src={avatarUrl || "/placeholder.webp"}
                alt="User Avatar"
                width={45}
                height={45}
                className={styles.avatar}
                priority={false}
                unoptimized={avatarUrl.startsWith("blob:")}
              />
            </div>
            {showProfilePopup && (
              <div className={styles.profilePopup}>
                <UserProfileCard
                  name={`${user.lastName} ${user.firstName} ${user.middleName}`}
                  role={user.role === "student" ? "Студент" : user.role === "doctor" ? "Врач" : "Администратор"}
                  avatar={user.avatar}
                  avatarUrl={user.avatarUrl}
                  avatarId={user.avatarId}
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
