import styles from "./ArticleAbstract.module.css"

interface ArticleAbstractProps {
  abstract: string
}

export function ArticleAbstract({ abstract }: ArticleAbstractProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Аннотация</h2>
      <p className={styles.content}>{abstract}</p>
    </div>
  )
}
