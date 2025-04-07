"use client"

import { useDispatch, useSelector } from "react-redux"
import { toggleArticleType } from "@/features/article-filters/model/slice"
import { selectFiltersState } from "@/features/article-filters/model/selectors"
import { articleTypes } from "@/features/article-filters/model/constants"
import type { AppDispatch } from "@/app/store"
import styles from "./ArticleTypeFilter.module.css"

export function ArticleTypeFilter() {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedArticleTypes } = useSelector(selectFiltersState)

  const handleTypeToggle = (type: string) => {
    dispatch(toggleArticleType(type))
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Тип статьи</h3>

      <div className={styles.typesList}>
        {articleTypes.map((type) => (
          <div key={type.value} className={styles.typeItem}>
            <label className={styles.typeLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedArticleTypes.includes(type.value)}
                onChange={() => handleTypeToggle(type.value)}
              />
              <span className={styles.typeName}>{type.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

