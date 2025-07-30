import http from "@/shared/api/http"
import type { SearchResponse } from "../model/types"

export const searchUsers = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await http.get(`https://api.doclearn.ru/user/search?q=${encodeURIComponent(query)}`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error("Слишком много поисковых запросов. Попробуйте позже.")
    }
    throw new Error("Что-то пошло не так. Попробуйте позже.")
  }
}
