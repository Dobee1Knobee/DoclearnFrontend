"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import styles from "../../admin-users/ui/AdminUsers.module.css"

interface AdminModerationErrorProps {
  error: string
  onRetry: () => void
}

export function AdminModerationError({ error, onRetry }: AdminModerationErrorProps) {
  return (
    <div className={styles.errorContainer}>
      <AlertCircle size={48} className={styles.errorIcon} />
      <h3 className={styles.errorTitle}>Ошибка загрузки пользователей</h3>
      <p className={styles.errorText}>{error}</p>
      <button onClick={onRetry} className={styles.retryButton}>
        <RefreshCw size={16} />
        Попробовать снова
      </button>
    </div>
  )
}
