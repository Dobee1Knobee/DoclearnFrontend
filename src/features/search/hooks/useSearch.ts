"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useKeyboardNavigation } from "@/shared/hooks/useKeyboardNavigation"
import { searchUsers } from "../api/searchApi"
import type { SearchUser, SearchState } from "../model/types"

export const useSearch = () => {
  const router = useRouter()
  const [state, setState] = useState<SearchState>({
    query: "",
    results: [],
    totalCount: 0,
    isLoading: false,
    error: null,
    selectedIndex: -1,
    isOpen: false,
  })

  const debouncedQuery = useDebounce(state.query, 300)
  const searchCache = useRef(new Map<string, { results: SearchUser[]; count: number; timestamp: number }>())
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearErrorAfterTimeout = useCallback((errorMessage: string) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }

    if (errorMessage.includes("Слишком много поисковых запросов")) {
      errorTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, error: null }))
      }, 30000)
    }
  }, [])

  const performSearch = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setState((prev) => ({
          ...prev,
          results: [],
          totalCount: 0,
          isLoading: false,
          error: null,
          isOpen: false,
          selectedIndex: -1,
        }))
        return
      }

      const cached = searchCache.current.get(query)
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        setState((prev) => ({
          ...prev,
          results: cached.results,
          totalCount: cached.count,
          isLoading: false,
          error: null,
          isOpen: true,
          selectedIndex: -1,
        }))
        return
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await searchUsers(query.trim())
        console.log("Ответ от поиска: ", response)

        searchCache.current.set(query, {
          results: response.data.usersWithAvatars,
          count: response.data.total,
          timestamp: Date.now(),
        })

        setState((prev) => ({
          ...prev,
          results: response.data.usersWithAvatars,
          totalCount: response.data.total,
          isLoading: false,
          error: null,
          isOpen: true,
          selectedIndex: -1,
        }))
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Что-то пошло не так. Попробуйте позже."
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isOpen: true,
          selectedIndex: -1,
        }))
        clearErrorAfterTimeout(errorMessage)
      }
    },
    [clearErrorAfterTimeout],
  )

  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }))
  }, [])

  const setSelectedIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, selectedIndex: index }))
  }, [])

  const selectResult = useCallback(
    (user?: SearchUser) => {
      const userToSelect = user || state.results[state.selectedIndex]
      if (userToSelect) {
        router.push(`/profile/${userToSelect._id}`)
        setState((prev) => ({ ...prev, isOpen: false, selectedIndex: -1 }))
      }
    },
    [state.results, state.selectedIndex, router],
  )

  const closeSearch = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, selectedIndex: -1 }))
  }, [])

  const clearSearch = useCallback(() => {
    setState({
      query: "",
      results: [],
      totalCount: 0,
      isLoading: false,
      error: null,
      selectedIndex: -1,
      isOpen: false,
    })
  }, [])

  const { handleKeyDown } = useKeyboardNavigation({
    isOpen: state.isOpen,
    resultsLength: Math.min(state.results.length, 5),
    selectedIndex: state.selectedIndex,
    onSelectIndex: setSelectedIndex,
    onSelectResult: () => selectResult(),
    onClose: closeSearch,
  })

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  return {
    query: state.query,
    results: state.results.slice(0, 5),
    totalCount: state.totalCount,
    isLoading: state.isLoading,
    error: state.error,
    selectedIndex: state.selectedIndex,
    isOpen: state.isOpen,
    setQuery,
    selectResult,
    closeSearch,
    clearSearch,
    handleKeyDown,
  }
}
