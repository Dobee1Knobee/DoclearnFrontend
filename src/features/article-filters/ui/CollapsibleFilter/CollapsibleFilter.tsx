"use client"

import type React from "react"

import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./CollapsibleFilter.module.css"

interface CollapsibleFilterProps {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function CollapsibleFilter({ title, isExpanded, onToggle, children }: CollapsibleFilterProps) {
  return (
    <div className={styles.container}>
      <button className={styles.header} onClick={onToggle}>
        <h3 className={styles.title}>{title}</h3>
        {isExpanded ? (
          <ChevronUp size={18} className={styles.icon} />
        ) : (
          <ChevronDown size={18} className={styles.icon} />
        )}
      </button>

      {isExpanded && <div className={styles.content}>{children}</div>}
    </div>
  )
}

