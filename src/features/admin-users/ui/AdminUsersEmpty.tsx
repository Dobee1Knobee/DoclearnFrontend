import { Users } from "lucide-react"
import styles from "./AdminUsers.module.css"

export function AdminUsersEmpty() {
  return (
    <div className={styles.placeholder}>
      <Users size={48} className={styles.placeholderIcon} />
      <h3 className={styles.placeholderTitle}>Пользователи не найдены</h3>
      <p className={styles.placeholderText}>В системе пока нет зарегистрированных пользователей</p>
    </div>
  )
}
