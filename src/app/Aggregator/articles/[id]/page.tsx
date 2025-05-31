import { ArticleDetail } from "@/widgets/ArticlePage/ArticleDetail"
import { mockArticles } from "@/entities/article/model/mockData"
import type { Metadata } from "next"

interface ArticlePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = mockArticles.find((article) => article.id === params.id)

  if (!article) {
    return {
      title: "Статья не найдена | DocLearn",
    }
  }

  return {
    title: `${article.title} | DocLearn`,
    description: article.abstract,
    keywords: article.keywords?.join(", "),
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = mockArticles.find((article) => article.id === params.id)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div style={{ marginTop: "7rem", marginBottom: "5rem" }}>
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <p>Статьи, которую Вы ищете не существует или она была удалена</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ marginTop: "7rem", marginBottom: "5rem" }}>
        <ArticleDetail article={article} />
      </div>
    </div>
  )
}
