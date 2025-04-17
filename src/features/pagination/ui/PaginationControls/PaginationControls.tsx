"use client"

import { useDispatch, useSelector } from "react-redux"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { setCurrentPage } from "@/features/pagination/model/slice"
import { selectPaginationState } from "@/features/pagination/model/selectors"
import type { AppDispatch } from "@/app/store"
import styles from "./PaginationControls.module.css"

interface PaginationControlsProps {
  totalResults: number
}

export function PaginationControls({ totalResults }: PaginationControlsProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { currentPage, resultsPerPage } = useSelector(selectPaginationState)

  const totalPages = Math.ceil(totalResults / resultsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (totalPages <= 1) return null

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 3

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          className={`${styles.pageButton} ${1 === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>,
      )

      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className={styles.ellipsis}>
            ...
          </span>,
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={styles.ellipsis}>
            ...
          </span>,
        )
      }

      pages.push(
        <button
          key={totalPages}
          className={`${styles.pageButton} ${totalPages === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
        <span>Предыдущая</span>
      </button>

      <div className={styles.pageNumbers}>{renderPageNumbers()}</div>

      <button
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span>Следующая</span>
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

