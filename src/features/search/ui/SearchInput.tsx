"use client"

import type React from "react"
import styles from "./SearchInput.module.css"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  placeholder: string
  className?: string
  autoFocus?: boolean
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className = "",
  autoFocus = false,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`${styles.searchInput} ${className}`}
      autoFocus={autoFocus}
    />
  )
}
