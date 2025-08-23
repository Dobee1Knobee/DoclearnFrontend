"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import styles from "./BanUserModal.module.css"

interface BanUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  userName: string
  isLoading?: boolean
}

export function BanUserModal({ isOpen, onClose, onConfirm, userName, isLoading = false }: BanUserModalProps) {
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (reason.trim()) {
      onConfirm(reason.trim())
    }
  }

  const handleClose = () => {
    setReason("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Заблокировать пользователя</h2>
          <button onClick={handleClose} className={styles.closeButton} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Вы собираетесь заблокировать пользователя <strong>{userName}</strong>. Пожалуйста, укажите причину
            блокировки.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="reason" className={styles.label}>
                Причина блокировки
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Укажите причину блокировки пользователя..."
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
              <button type="submit" className={styles.confirmButton} disabled={!reason.trim() || isLoading}>
                {isLoading ? "Блокировка..." : "Заблокировать"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
