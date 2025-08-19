import styles from "./AdminUsers.module.css"

export function AdminUsersSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление пользователями</h1>
          <p className={styles.subtitle}>Просмотр и управление пользователями системы</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            disabled
            className={styles.searchInput}
            style={{ paddingLeft: "2.5rem", opacity: 0.5 }}
          />
        </div>
        <select disabled className={styles.filterSelect} style={{ opacity: 0.5 }}>
          <option>Все роли</option>
        </select>
        <select disabled className={styles.filterSelect} style={{ opacity: 0.5 }}>
          <option>Все статусы</option>
        </select>
      </div>

      <div className={styles.spinnerContainer}>
        <div className={styles.spinner} />
        <p className={styles.spinnerText}>Загрузка пользователей...</p>
      </div>
    </div>
  )
}
