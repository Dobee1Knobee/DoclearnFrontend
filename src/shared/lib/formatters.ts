import { currencyTranslations, locationTypeTranslations, categoryTranslations } from "./translations"
import type { Currency, PriceType, AnnouncementLocation, AnnouncementCategory } from "@/entities/announcement/model"

export const formatPrice = (price: number, price_type: PriceType, currency: Currency): string => {
  if ( price_type ==="free" || price === 0) return "Бесплатно"
  const symbol = currencyTranslations[currency] || "₽"
  return `${symbol} ${price.toLocaleString()}`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export const getLocationText = (location?: AnnouncementLocation): string => {
  if (!location) return ""
  return location.city || locationTypeTranslations[location.type] || ""
}

export const translateCategory = (category: AnnouncementCategory): string => {
  return categoryTranslations[category] || category
}
