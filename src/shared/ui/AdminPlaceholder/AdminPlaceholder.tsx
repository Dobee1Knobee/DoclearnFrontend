import { Construction } from "lucide-react"
import styles from "./AdminPlaceholder.module.css"

interface AdminPlaceholderProps {
  title: string
  description?: string
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className={styles.container}>
      <Construction size={64} className={styles.icon} />
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
