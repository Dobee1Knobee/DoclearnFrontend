"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import styles from "./ActionModal.module.css"

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (comment: string) => void
  userName: string
  isLoading?: boolean
  type: "ban" | "reject"
}

export function ActionModal({ isOpen, onClose, onConfirm, userName, isLoading = false, type }: ActionModalProps) {
  const [comment, setComment] = useState("")

  const config = {
    ban: {
      title: "Заблокировать пользователя",
      description: `Вы собираетесь заблокировать пользователя ${userName}. Пожалуйста, укажите причину блокировки.`,
      label: "Причина блокировки",
      placeholder: "Укажите причину блокировки пользователя...",
      buttonText: isLoading ? "Блокировка..." : "Заблокировать",
      buttonClass: styles.banButton,
    },
    reject: {
      title: "Отклонить изменения",
      description: `Вы собираетесь отклонить изменения профиля пользователя ${userName}. Пожалуйста, укажите причину отклонения.`,
      label: "Причина отклонения",
      placeholder: "Укажите причину отклонения изменений...",
      buttonText: isLoading ? "Отклоняем..." : "Отклонить",
      buttonClass: styles.rejectButton,
    },
  }

  const currentConfig = config[type]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onConfirm(comment.trim())
    }
  }

  const handleClose = () => {
    setComment("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{currentConfig.title}</h2>
          <button onClick={handleClose} className={styles.closeButton} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{currentConfig.description}</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="comment" className={styles.label}>
                {currentConfig.label}
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={currentConfig.placeholder}
                className={styles.textarea}
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={handleClose} className={styles.cancelButton} disabled={isLoading}>
                Отмена
              </button>
              <button
                type="submit"
                className={`${styles.confirmButton} ${currentConfig.buttonClass}`}
                disabled={!comment.trim() || isLoading}
              >
                {currentConfig.buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
