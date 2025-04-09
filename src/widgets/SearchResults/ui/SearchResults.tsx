"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { SearchBar } from "@/features/article-search/ui/SearchBar/SearchBar"
import { FilterSidebar } from "@/features/article-filters/ui/FilterSidebar/FilterSidebar"
import { ResultsList } from "@/widgets/SearchResults/ui/ResultsList/ResultsList"
import { ResultsHeader } from "@/widgets/SearchResults/ui/ResultsHeader/ResultsHeader"
import { PaginationControls } from "@/features/pagination/ui/PaginationControls/PaginationControls"
import { searchArticles } from "@/entities/article/model/api"
import { setSearchResults, setLoading } from "@/entities/search/model/slice"
import { selectSearchState } from "@/entities/search/model/selectors"
import { selectPaginationState } from "@/features/pagination/model/selectors"
import { selectFiltersState } from "@/features/article-filters/model/selectors"
import type { AppDispatch } from "@/app/store"
import styles from "./SearchResults.module.css"

interface SearchResultsProps {
  initialQuery: string
}

export function SearchResults({ initialQuery }: SearchResultsProps) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { query, results, loading, totalResults } = useSelector(selectSearchState)
  const { currentPage, resultsPerPage } = useSelector(selectPaginationState)
  const filters = useSelector(selectFiltersState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      dispatch(setLoading(true))

      // задержка для "загрузки данных". Потом заменится на апи. 

      const timer = setTimeout(() => {
        searchArticles(query, filters, currentPage, resultsPerPage)
          .then((data) => {
            dispatch(setSearchResults(data))
          })
          .finally(() => {
            dispatch(setLoading(false))
          })
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [query, filters, currentPage, resultsPerPage, dispatch, mounted])

  const handleSearch = (searchQuery: string) => {
    router.push(`/Aggregator/search?q=${encodeURIComponent(searchQuery)}`)
  }

  if (!mounted) return null

  return (
    <div className={styles.container}>
      <div className={styles.searchBarContainer}>
        <SearchBar initialQuery={initialQuery} onSearch={handleSearch} />
      </div>

      <div className={styles.resultsContainer}>
        <aside className={styles.sidebar}>
          <FilterSidebar />
        </aside>

        <main className={styles.mainContent}>
          <ResultsHeader totalResults={totalResults} />
          <ResultsList articles={results} loading={loading} />

          {!loading && totalResults > 0 && (
            <div className={styles.paginationContainer}>
              <PaginationControls totalResults={totalResults} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

