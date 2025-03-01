import { Newspaper, MessageSquare, FileText } from "lucide-react"
import { Card } from "./Card"
import styles from "./CardGrid.module.css"

const cards = [
  {
    icon: Newspaper,
    title: "Новости",
    description: "Последние новости и актуальные события в сфере. Узнайте первыми о важных изменениях.",
    href: "/News",
  },
  {
    icon: MessageSquare,
    title: "Лента постов",
    description: "Лента постов от пользователей. Делитесь идеями и обсуждайте актуальные темы с коллегами.",
    href: "/Feed",
  },
  {
    icon: FileText,
    title: "Статьи",
    description: "Научные и популярные статьи, исследования и публикации. Получите глубокое понимание актуальных вопросов.",
    href: "/Articles",
  },
]

export function CardGrid() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <Card key={card.title} icon={card.icon} title={card.title} 
          description={card.description} href={card.href} />
        ))}
      </div>
    </div>
  )
}

