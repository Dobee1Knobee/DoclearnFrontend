import { Newspaper, MessageSquare, FileText } from "lucide-react"
import type { CardData } from "./types"

export const DEFAULT_CARDS: CardData[] = [
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
    description:
      "Агрегатор научных и популярных статей, исследований и публикаций. Получите глубокое понимание актуальных вопросов.",
    href: "/Aggregator",
  },
]

