import styles from "./ArticleSkeleton.module.css"

export function ArticleSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}></div>
        <div className={styles.bookmark}></div>
      </div>

      <div className={styles.authors}></div>

      <div className={styles.abstract}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line} style={{ width: "75%" }}></div>
      </div>

      <div className={styles.tags}>
        <div className={styles.tag}></div>
        <div className={styles.tag}></div>
        <div className={styles.tag}></div>
      </div>

      <div className={styles.footer}>
        <div className={styles.citations}></div>
        <div className={styles.actions}>
          <div className={styles.action}></div>
          <div className={styles.action}></div>
        </div>
      </div>
    </div>
  )
}

