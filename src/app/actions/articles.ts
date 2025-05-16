"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type GetArticlesParams = {
  page?: number;
  search?: string;
  category?: string;
  sort?: 'newest' | 'oldest' | 'title';
  pageSize?: number;
};

export async function getArticles({
  page = 1,
  search = '',
  category = '',
  sort = 'newest',
  pageSize = 12
}: GetArticlesParams) {
  try {
    const where: Prisma.ArticleWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
              ],
            }
          : {},
        category
          ? {
              category: {
                slug: { equals: category, mode: Prisma.QueryMode.insensitive },
              },
            }
          : {},
      ],
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
          ...(sort === 'newest' && { createdAt: 'desc' }),
          ...(sort === 'oldest' && { createdAt: 'asc' }),
          ...(sort === 'title' && { title: 'asc' }),
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ]);

    const hasMore = total > page * pageSize;

    return {
      articles,
      hasMore,
      total,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }
}

export type CreateArticleParams = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  categoryId: string;
  published?: boolean;
};

export async function createArticle(data: CreateArticleParams) {
  try {
    const session = await auth();
    
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      throw new Error('Unauthorized');
    }

    const { title, slug, content, excerpt, image, categoryId, published } = data;

    if (!title || !slug || !content || !categoryId) {
      throw new Error('Title, slug, content and category are required');
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id,
        categoryId
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    revalidatePath('/articles');
    return article;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
} 