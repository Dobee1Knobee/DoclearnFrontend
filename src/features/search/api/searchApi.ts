import http from "@/shared/api/http"
import type { SearchResponse } from "../model/types"

export const searchUsers = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await http.get("/user/search", {
      params: {
        q: query,
      },
    })
    return response.data
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error("Слишком много поисковых запросов. Попробуйте позже.")
    }
    throw new Error("Что-то пошло не так. Попробуйте позже.")
  }
}
