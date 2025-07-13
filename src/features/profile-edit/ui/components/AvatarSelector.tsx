"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Modal, Button } from "react-bootstrap"
import styles from "./AvatarSelector.module.css"
import { Plus } from "lucide-react"

interface AvatarSelectorProps {
  currentAvatar: string
  onAvatarChange: (avatar: string) => void
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onAvatarChange }) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)

  const avatars = Array.from({ length: 22 }, (_, i) => `/Avatars/Avatar${i + 1}.webp`)

  const handleSave = () => {
    onAvatarChange(selectedAvatar)
    setShowModal(false)
  }

  const handleCancel = () => {
    setSelectedAvatar(currentAvatar)
    setShowModal(false)
  }

  const handleRandomAvatar = () => {
    const availableAvatars = avatars.filter((avatar) => avatar !== currentAvatar)

    const avatarsToChooseFrom = availableAvatars.length > 0 ? availableAvatars : avatars

    const randomIndex = Math.floor(Math.random() * avatarsToChooseFrom.length)
    const randomAvatar = avatarsToChooseFrom[randomIndex]

    onAvatarChange(randomAvatar)
  }


  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Аватар</h3>
        <div className={styles.currentAvatar} onClick={() => setShowModal(true)}>
          <Image
            src={currentAvatar || "/placeholder.svg"}
            alt="Текущий аватар"
            width={120}
            height={120}
            className={styles.avatarImage}
          />
          <div className={styles.overlay}>
            <span>Изменить</span>
          </div>
        </div>
        
        <button
          className={styles.addButton}
          onClick={handleRandomAvatar}
          type="button"
        >
          {/* <Plus size={16} /> */}
          Случайная аватарка
        </button>
      </div>

      {/* <Modal show={showModal} onHide={handleCancel} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Выберите аватар</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.avatarGrid}>
            {avatars.map((avatar) => (
              <div
                key={avatar}
                className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ""}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <Image
                  src={avatar || "/placeholder.svg"}
                  alt="Аватар"
                  width={80}
                  height={80}
                  className={styles.optionImage}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  )
}
