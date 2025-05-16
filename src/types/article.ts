import { Article as PrismaArticle } from "@prisma/client";

export type Article = PrismaArticle & {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
  };
};

export interface ArticleCardProps {
  article: Article;
  index: number;
}

export interface GetArticlesParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "title";
  search?: string;
  category?: string;
}

export interface GetArticlesResponse {
  articles: Article[];
  hasMore: boolean;
  total: number;
} 