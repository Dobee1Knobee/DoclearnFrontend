import { User } from "lucide-react"
import styles from "./AdminModeration.module.css"

export function AdminModerationEmpty() {
  return (
    <div className={styles.placeholder}>
      <User size={48} className={styles.placeholderIcon} />
      <h3 className={styles.placeholderTitle}>Нет изменений профилей на модерации</h3>
      <p className={styles.placeholderText}>Все изменения профилей проверены</p>
    </div>
  )
}
