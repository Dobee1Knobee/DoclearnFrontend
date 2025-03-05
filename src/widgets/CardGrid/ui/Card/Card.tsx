import styles from "./Card.module.css"
import Link from "next/link"
import type { CardData } from "../../model/types"

export function Card({ icon: Icon, title, description, href }: CardData) {
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

