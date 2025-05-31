"use client"

import { useState } from "react"
import { ArticleHeader } from "./ui/ArticleHeader/ArticleHeader"
import { ArticleAbstract } from "./ui/ArticleAbstract/ArticleAbstract"
import { ArticleKeywords } from "./ui/ArticleKeywords/ArticleKeywords"
import { ArticleMetadata } from "./ui/ArticleMetadata/ArticleMetadata"
import { RelatedArticles } from "./ui/RelatedArticles/RelatedArticles"
import { mockArticles } from "@/entities/article/model/mockData"
import type { Article } from "@/entities/article/model/types"
import styles from "./ArticleDetail.module.css"

interface ArticleDetailProps {
  article: Article
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleDownloadPDF = () => {
    console.log("Скачан пдф:", article.id)
  }

  const handleShare = () => {
    console.log("Поделиться:", article.id)
  }

  const getRelatedArticles = () => {
    if (!article.keywords || article.keywords.length === 0) return []

    return mockArticles
      .filter((a) => a.id !== article.id && a.keywords?.some((keyword) => article.keywords?.includes(keyword)))
      .slice(0, 3)
  }

  const relatedArticles = getRelatedArticles()

  return (
    <div className={styles.container}>
      <ArticleHeader
        title={article.title}
        authors={article.authors}
        journal={article.journal}
        publishedDate={article.publishedDate}
        doi={article.doi}
        onSave={handleSave}
        onDownloadPDF={handleDownloadPDF}
        onShare={handleShare}
        isSaved={isSaved}
      />

      <ArticleAbstract abstract={article.abstract || ""} />

      {article.keywords && article.keywords.length > 0 && <ArticleKeywords keywords={article.keywords} />}

      <div className={styles.metadataContainer}>
        <ArticleMetadata article={article} />
      </div>

      {relatedArticles.length > 0 && <RelatedArticles articles={relatedArticles} />}
    </div>
  )
}
