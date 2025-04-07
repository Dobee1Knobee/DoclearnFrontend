"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Search } from "lucide-react"
import { setSearchQuery } from "@/entities/search/model/slice"
import type { AppDispatch } from "@/app/store"
import styles from "./SearchBar.module.css"

interface SearchBarProps {
  initialQuery?: string
  onSearch: (query: string) => void
}

export function SearchBar({ initialQuery = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      dispatch(setSearchQuery(query.trim()))
      onSearch(query.trim())
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск по статьям, авторам или тегам..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.searchButton}>
        Поиск
      </button>
    </form>
  )
}

