"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import styles from "./SearchDropdown.module.css"
import { SearchResultItem } from "./SearchResultItem"
import { SearchLoading, SearchEmpty, SearchError, ShowAllButton } from "./SearchStates"
import type { SearchUser } from "../model/types"

interface SearchDropdownProps {
  isOpen: boolean
  results: SearchUser[]
  totalCount: number
  isLoading: boolean
  error: string | null
  selectedIndex: number
  onSelectResult: (user: SearchUser) => void
  onClose: () => void
  isMobile?: boolean
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  results,
  totalCount,
  isLoading,
  error,
  selectedIndex,
  onSelectResult,
  onClose,
  isMobile = false,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const renderContent = () => {
    if (isLoading) {
      return <SearchLoading />
    }

    if (error) {
      return <SearchError message={error} />
    }

    if (totalCount === 0) {
      return <SearchEmpty />
    }

    return (
      <>
        {results.map((user, index) => (
          <SearchResultItem
            key={user._id}
            user={user}
            isSelected={index === selectedIndex}
            onClick={() => onSelectResult(user)}
          />
        ))}
        {totalCount > 5 && (
          <ShowAllButton
            totalCount={totalCount}
            onClick={() => {}} // Пока неактивна
            disabled={true}
          />
        )}
      </>
    )
  }

  return (
    <div ref={dropdownRef} className={`${styles.dropdown} ${isMobile ? styles.mobile : ""}`}>
      {renderContent()}
    </div>
  )
}
