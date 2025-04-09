"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, FileText, Eye } from "lucide-react"
import { ArticleTags } from "@/entities/article/ui/ArticleTags/ArticleTags"
import type { Article } from "@/entities/article/model/types"
import styles from "./ArticleCard.module.css"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handlePdfClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Логика загрузки  или перехода к PDF файлу 
    console.log(`Переход к pdf статьи: ${article.id}`)
  }

  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Мб сделать переход на пабмед с их статьей 

    console.log(`Переход к полному тексту статьи: ${article.id}`)
  }

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <Link href={`/Aggregator/articles/${article.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{article.title}</h2>
        </Link>

        <button
          className={`${styles.saveButton} ${isSaved ? styles.saved : ""}`}
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Убрать из сохраненного" : "Добавить в сохраненное"}
        >
          <Bookmark size={20} />
        </button>
      </div>

      <div className={styles.authors}>
        {article.authors.join(", ")}
        {article.journal && (
          <>
            <span className={styles.separator}>•</span>
            <span className={styles.journal}>{article.journal}</span>
          </>
        )}
        {article.publishedDate && (
          <>
            <span className={styles.separator}>•</span>
            <span className={styles.date}>{article.publishedDate}</span>
          </>
        )}
      </div>

      {article.abstract && <p className={styles.abstract}>{article.abstract}</p>}

      {article.keywords && article.keywords.length > 0 && <ArticleTags keywords={article.keywords} />}

      <div className={styles.footer}>
        <div className={styles.citations}>
          {article.citations && <span>Цитирование: {article.citations}</span>}
          {article.doi && (
            <>
              <span className={styles.separator}>•</span>
              <span>DOI: {article.doi}</span>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handlePdfClick} aria-label="Download PDF">
            <FileText size={16} />
            <span>PDF</span>
          </button>

          <button className={styles.actionButton} onClick={handleViewClick} aria-label="View article">
            <Eye size={16} />
            <span>Просмотреть</span>
          </button>
        </div>
      </div>
    </article>
  )
}

