"use client"

import { Bookmark, Download, Share2 } from "lucide-react"
import styles from "./ArticleHeader.module.css"

interface ArticleHeaderProps {
  title: string
  authors: string[]
  journal?: string
  publishedDate?: string
  doi?: string
  isSaved: boolean
  onSave: () => void
  onDownloadPDF: () => void
  onShare: () => void
}

export function ArticleHeader({
  title,
  authors,
  journal,
  publishedDate,
  doi,
  isSaved,
  onSave,
  onDownloadPDF,
  onShare,
}: ArticleHeaderProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.authors}>
        {authors.join(", ")}
        {journal && (
          <>
            <span className={styles.separator}>•</span>
            <span className={styles.journal}>{journal}</span>
          </>
        )}
      </div>

      <div className={styles.metadata}>
        {publishedDate && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Опубликована:</span> {publishedDate}
          </div>
        )}

        {doi && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>DOI:</span> {doi}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${isSaved ? styles.saved : ""}`}
          onClick={onSave}
          aria-label={isSaved ? "Убрать из избранного" : "В избрранное"}
        >
          <Bookmark size={18} />
          <span>В избранное</span>
        </button>

        <button className={styles.actionButton} onClick={onDownloadPDF} aria-label="Скачать PDF">
          <Download size={18} />
          <span>Скачать PDF</span>
        </button>

        <button className={styles.actionButton} onClick={onShare} aria-label="Поделиться">
          <Share2 size={18} />
          <span>Поделиться</span>
        </button>

        <button className={styles.fullTextButton}>Полный текст</button>
      </div>
    </div>
  )
}
