"use client"

import { useSelector } from "react-redux"
import { selectUser } from "@/features/auth/model/selectors"
import { Ban } from "lucide-react"
import styles from "./page.module.css"

export default function BlockedPage() {
  const user = useSelector(selectUser)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Ban size={64} className={styles.icon}/>
        <h1 className={styles.title}>Аккаунт заблокирован</h1>
        <div className={styles.reason}>
          <p className={styles.reasonLabel}>Причина блокировки:</p>
          <p className={styles.reasonText}>{user?.banReason || "Нарушение правил платформы"}</p>
        </div>
        <div className={styles.support}>
          <p>Если вы считаете, что ваш аккаунт был заблокирован по ошибке, свяжитесь с нами по адресу:</p>
          <a href="mailto:support@doclearn.ru" className={styles.email}>
            support@doclearn.ru
          </a>
        </div>
      </div>
    </div>
  )
}
