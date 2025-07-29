"use client"

import type React from "react"
import { Spinner } from "react-bootstrap"
import styles from "./SearchStates.module.css"

export const SearchLoading: React.FC = () => (
  <div className={styles.stateContainer}>
    <Spinner animation="border" size="sm" className={styles.spinner} />
    <span className={styles.text}>Поиск...</span>
  </div>
)

export const SearchEmpty: React.FC = () => (
  <div className={styles.stateContainer}>
    <span className={styles.text}>По Вашему запросу ничего не найдено.</span>
  </div>
)

interface SearchErrorProps {
  message: string
}

export const SearchError: React.FC<SearchErrorProps> = ({ message }) => (
  <div className={styles.stateContainer}>
    <span className={`${styles.text} ${styles.error}`}>{message}</span>
  </div>
)

interface ShowAllButtonProps {
  totalCount: number
  onClick: () => void
  disabled?: boolean
}

export const ShowAllButton: React.FC<ShowAllButtonProps> = ({ totalCount, onClick, disabled = true }) => (
  <div className={styles.showAllContainer}>
    <button
      className={`${styles.showAllButton} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      Показать всё ({totalCount})
    </button>
  </div>
)
