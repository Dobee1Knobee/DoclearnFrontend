"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { DateFilter } from "@/features/article-filters/ui/DateFilter/DateFilter"
import { ArticleTypeFilter } from "@/features/article-filters/ui/ArticleTypeFilter/ArticleTypeFilter"
import { JournalFilter } from "@/features/article-filters/ui/JournalFilter/JournalFilter"
import { CollapsibleFilter } from "@/features/article-filters/ui/CollapsibleFilter/CollapsibleFilter"
import { applyFilters } from "@/features/article-filters/model/slice"
import type { AppDispatch } from "@/app/store"
import styles from "./FilterSidebar.module.css"

export function FilterSidebar() {
  const dispatch = useDispatch<AppDispatch>()
  const [isAuthorsExpanded, setIsAuthorsExpanded] = useState(false)
  const [isLanguagesExpanded, setIsLanguagesExpanded] = useState(false)

  const handleApplyFilters = () => {
    dispatch(applyFilters())
  }

  return (
    <div className={styles.container}>
      <DateFilter />
      <ArticleTypeFilter />
      <JournalFilter />

      <CollapsibleFilter
        title="Авторы"
        isExpanded={isAuthorsExpanded}
        onToggle={() => setIsAuthorsExpanded(!isAuthorsExpanded)}
      >
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>Фильтры по авторам</p>
        </div>
      </CollapsibleFilter>

      <CollapsibleFilter
        title="Языки"
        isExpanded={isLanguagesExpanded}
        onToggle={() => setIsLanguagesExpanded(!isLanguagesExpanded)}
      >
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>Фильтры по языку</p>
        </div>
      </CollapsibleFilter>

      <button className={styles.applyButton} onClick={handleApplyFilters}>
        Применить фильтры
      </button>
    </div>
  )
}

