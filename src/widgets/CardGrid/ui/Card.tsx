import type { LucideIcon } from "lucide-react"
import styles from "./Card.module.css"
import Link from "next/link"


interface CardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export function Card({ icon: Icon, title, description, href }: CardProps) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} aria-hidden="true" />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </Link>
  )
}

