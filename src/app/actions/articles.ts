"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { GetArticlesParams } from "@/types/article";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";

export async function getArticles({
  page = 1,
  limit = 12,
  sort = "newest",
  search,
  category,
}: GetArticlesParams = {}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {
      published: {
        not: null,
      },
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(category && {
        category: {
          slug: category,
        },
      }),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        orderBy: {
          ...(sort === "newest" && { createdAt: "desc" }),
          ...(sort === "oldest" && { createdAt: "asc" }),
          ...(sort === "title" && { title: "asc" }),
        },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const hasMore = skip + articles.length < total;

    return {
      articles,
      hasMore,
      total,
    };
  } catch (error) {
    console.error("Error in getArticles:", error);
    throw new Error("Failed to fetch articles");
  }
}

export async function getArticle(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        category: true,
      },
    });

    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}


export async function getSimilarArticles(articleId: string, categoryId: string, limit = 3) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        id: { not: articleId },
        categoryId,
        published: {
          not: null,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return articles;
  } catch (error) {
    console.error("Error fetching similar articles:", error);
    throw error;
  }
}

export async function getArticleInEditor(slug: string) {
  const session = await auth();
  if (!session?.user) return null;

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        category: true,
      },
    });

    if (article?.authorId !== session.user.id) return null;

    return article;
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}

export async function createOrUpdateArticle(data: {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  image?: string;
  status: "draft" | "published";
  slug?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    let categoryId = data.categoryId;
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      const defaultCategory = await prisma.category.findUnique({ where: { id: "uncategorized" } });
      if (!defaultCategory) throw new Error("Category not found");
      categoryId = defaultCategory.id;
    }

    const articleData: any = {
      title: data.title || "مقاله بدون عنوان",
      content: data.content,
      categoryId,
      published: data.status === "published" ? new Date() : null,
    };
    if (data.excerpt !== undefined) articleData.excerpt = data.excerpt;
    if (data.image !== undefined) articleData.image = data.image;

    if (data.id) {
      const article = await prisma.article.findUnique({ where: { id: data.id } });
      if (!article) throw new Error("Article not found");
      if (article.authorId !== session.user.id) throw new Error("Unauthorized");

      const updatedArticle = await prisma.article.update({
        where: { id: data.id },
        data: articleData,
      });

      revalidatePath("/articles");
      return updatedArticle;
    } else {
      let slug = data.slug;
      if (!slug) {
        const baseSlug = data.title ? slugify(data.title, { lower: true }) : `article-${Date.now()}`;

        let uniqueSlug = baseSlug;
        for (let i = 0; i < 5; i++) {
          const existing = await prisma.article.findUnique({ where: { slug: uniqueSlug } });
          if (!existing) break;
          uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
        }
        slug = uniqueSlug;
      }

      const newArticle = await prisma.article.create({
        data: {
          ...articleData,
          slug,
          authorId: session.user.id,
        },
      });

      revalidatePath("/articles");
      return newArticle;
    }
  } catch (error) {
    console.error("Error in createOrUpdateArticle:", error);
    throw error;
  }
}