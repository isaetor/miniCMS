'use server'

import { auth } from "@/lib/auth";
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

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "شما مجوز ایجاد دسته‌بندی را ندارید" };
  }

  try {
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, message: "دسته‌بندی با این اسلاگ قبلاً وجود دارد" };
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });

    return { success: true, category };
  } catch (error) {
    console.error("خطا در ایجاد دسته‌بندی:", error);
    return { success: false, message: "خطا در ایجاد دسته‌بندی" };
  }
}

export async function updateCategory(data: {
  id: string;
  name: string;
  slug: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "شما نمیتوانید دسته بندی را به روز کنید" };
  }

  const category = await prisma.category.update({
    where: { id: data.id },
    data: { name: data.name, slug: data.slug, description: data.description },
    });

  return { success: true, category };
}

export async function deleteCategory(ids: string[]) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, message: "شما نمیتوانید دسته بندی را حذف کنید" };
  }

  const category = await prisma.category.deleteMany({
    where: { id: { in: ids } },
  });

  return { success: true, category };
}
