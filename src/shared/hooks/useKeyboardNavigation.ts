"use client"

import type React from "react"

import { useCallback } from "react"

interface UseKeyboardNavigationProps {
  isOpen: boolean
  resultsLength: number
  selectedIndex: number
  onSelectIndex: (index: number) => void
  onSelectResult: () => void
  onClose: () => void
}

export const useKeyboardNavigation = ({
  isOpen,
  resultsLength,
  selectedIndex,
  onSelectIndex,
  onSelectResult,
  onClose,
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          onSelectIndex(Math.min(selectedIndex + 1, resultsLength - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          onSelectIndex(Math.max(selectedIndex - 1, -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0) {
            onSelectResult()
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    },
    [isOpen, selectedIndex, resultsLength, onSelectIndex, onSelectResult, onClose],
  )

  return { handleKeyDown }
}
