
import { Construction } from "lucide-react"
import styles from "./UnderDevelopment.module.css"

interface UnderDevelopmentProps {
  title: string
  description?: string
}

export function UnderDevelopment({ title, description }: UnderDevelopmentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Construction className={styles.icon} />
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  )
}
