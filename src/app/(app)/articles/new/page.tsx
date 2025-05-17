import { notFound } from "next/navigation";
import ArticleForm from "@/components/app/articles/ArticleForm";
import { getArticleInEditor } from "@/app/actions/articles";
import { getCategories } from "@/app/actions/categories";

interface Props {
  searchParams: { slug?: string };
}

export default async function ArticleEditPage({ searchParams }: Props) {
  const slug = searchParams.slug;

  let article = null;

  if (slug) {
    article = await getArticleInEditor(slug);
    if (!article) {
      notFound();
    }
  }

  const categories = await getCategories();

  return <ArticleForm initialArticle={article} categories={categories} />;
}
