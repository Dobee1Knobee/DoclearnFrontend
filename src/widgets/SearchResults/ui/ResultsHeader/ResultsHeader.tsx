"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import { setSortOption } from "@/features/article-filters/model/slice"
import { selectFiltersState } from "@/features/article-filters/model/selectors"
import type { SortOption } from "@/features/article-filters/model/types"
import styles from "./ResultsHeader.module.css"

interface ResultsHeaderProps {
  totalResults: number
}

export function ResultsHeader({ totalResults }: ResultsHeaderProps) {
  const dispatch = useDispatch()
  const { sortOption } = useSelector(selectFiltersState)

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortOption(e.target.value as SortOption))
  }
 
  return (
    <div className={styles.container}>
      <div className={styles.resultsCount}>

        {/* Добавить смену окончаний в зависимости от числа статей */}
        
        
        {totalResults} {totalResults === 1 ? "результат" : "результатов"} найдено
      </div>

      <div className={styles.sortContainer}>
        <span className={styles.sortLabel}>Сортировка:</span>
        <select className={styles.sortSelect} value={sortOption} onChange={handleSortChange}>
          <option value="relevance">Релевантные</option>
          <option value="date_desc">Сначала новые</option>
          <option value="date_asc">Сначала старые</option>
          <option value="citations">Наиболее цитируемые</option>
        </select>
      </div>
    </div>
  )
}

