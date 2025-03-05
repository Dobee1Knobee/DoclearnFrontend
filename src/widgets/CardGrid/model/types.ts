import type { LucideIcon } from "lucide-react"

export interface CardData {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

export interface CardGridProps {
  cards?: CardData[]
}

