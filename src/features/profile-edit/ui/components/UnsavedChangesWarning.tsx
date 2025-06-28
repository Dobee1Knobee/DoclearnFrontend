"use client"

import type React from "react"

import { useEffect } from "react"

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean
}

export const UnsavedChangesWarning: React.FC<UnsavedChangesWarningProps> = ({ hasUnsavedChanges }) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  return null
}
