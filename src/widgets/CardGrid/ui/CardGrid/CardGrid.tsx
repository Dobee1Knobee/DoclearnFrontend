import { Card } from "../Card/Card"
import styles from "./CardGrid.module.css"
import { DEFAULT_CARDS } from "../../model/constans"
import type { CardGridProps } from "../../model/types"

export function CardGrid({ cards = DEFAULT_CARDS }: CardGridProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </div>
  )
}
