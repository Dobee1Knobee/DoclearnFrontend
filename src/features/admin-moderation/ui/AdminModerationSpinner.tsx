import styles from "./AdminModeration.module.css"

export function AdminModerationSpinner() {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerIcon}></div>
      <p>Загрузка данных модерации...</p>
    </div>
  )
}
