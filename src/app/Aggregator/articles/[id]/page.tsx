import { ArticleDetail } from "@/widgets/ArticlePage/ArticleDetail";
import { mockArticles } from "@/entities/article/model/mockData";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = mockArticles.find((article) => article.id === id);

  if (!article) {
    return { title: "Статья не найдена | DocLearn" };
  }

  return {
    title: `${article.title} | DocLearn`,
    description: article.abstract,
    keywords: article.keywords?.join(", "),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = mockArticles.find((article) => article.id === id);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div style={{ marginTop: "7rem", marginBottom: "5rem" }}>
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <p>Статьи, которую вы ищете, не существует или она была удалена</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div style={{ marginTop: "7rem", marginBottom: "5rem" }}>
        <ArticleDetail article={article} />
      </div>
    </div>
  );
}
