"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { GetArticlesParams } from "@/types/article";

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
      published: true,
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
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

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
        published: true,
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