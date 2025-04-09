import { mockArticles } from "./mockData"
import type { SearchResponse } from "./types"
import type { FiltersState } from "@/features/article-filters/model/types"

export async function searchArticles(
  query: string,
  filters: FiltersState,
  page: number,
  resultsPerPage: number,
): Promise<SearchResponse> {

  // Потом заменить на работу с API

  return new Promise((resolve) => {
    let filteredArticles = [...mockArticles]

    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.abstract?.toLowerCase().includes(lowerQuery) ||
          article.authors.some((author) => author.toLowerCase().includes(lowerQuery)) ||
          article.keywords?.some((keyword) => keyword.toLowerCase().includes(lowerQuery)),
      )
    }

    // Применение фильтров(тестовая)
    if (filters.selectedArticleTypes.length > 0) {
      filteredArticles = filteredArticles.filter(
        (article) => article.type && filters.selectedArticleTypes.includes(article.type),
      )
    }

    if (filters.selectedJournals.length > 0) {
      filteredArticles = filteredArticles.filter(
        (article) => article.journal && filters.selectedJournals.includes(article.journal),
      )
    }

    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from)
      filteredArticles = filteredArticles.filter((article) => {
        if (!article.publishedDate) return true
        const articleDate = new Date(article.publishedDate)
        return articleDate >= fromDate
      })
    }

    if (filters.dateRange.to) {
      const toDate = new Date(filters.dateRange.to)
      filteredArticles = filteredArticles.filter((article) => {
        if (!article.publishedDate) return true
        const articleDate = new Date(article.publishedDate)
        return articleDate <= toDate
      })
    }

    // Применить сортирвовку(тестовая)
    if (filters.sortOption === "date_desc") {
      filteredArticles.sort((a, b) => {
        if (!a.publishedDate) return 1
        if (!b.publishedDate) return -1
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      })
    } else if (filters.sortOption === "date_asc") {
      filteredArticles.sort((a, b) => {
        if (!a.publishedDate) return 1
        if (!b.publishedDate) return -1
        return new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
      })
    } else if (filters.sortOption === "citations") {
      filteredArticles.sort((a, b) => {
        const citationsA = a.citations || 0
        const citationsB = b.citations || 0
        return citationsB - citationsA
      })
    }

    // Пагинация
    const startIndex = (page - 1) * resultsPerPage
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + resultsPerPage)

    resolve({
      results: paginatedArticles,
      totalResults: filteredArticles.length,
    })
  })
}

