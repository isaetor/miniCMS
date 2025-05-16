'use server'

import { prisma } from "@/lib/prisma";

interface GetCategoriesOptions {
  popular?: boolean
  limit?: number
}

export async function getCategories(options: GetCategoriesOptions = {}) {

  const { popular, limit } = options;

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    ...(limit && { take: limit }),
    ...(popular && {
      orderBy: {
        articles: {
          _count: 'desc'
        }
      }
    })
  });

  return categories;
}