export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
    if (diffInMinutes < 60) {
      return `${diffInMinutes} минут назад`
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} ${formatHours(diffInHours)} назад`
    }
  
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) {
      return "Вчера"
    }
  
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    })
  }
  
  function formatHours(hours: number): string {
    if (hours === 1) return "час"
    if (hours >= 2 && hours <= 4) return "часа"
    return "часов"
  }
  
  