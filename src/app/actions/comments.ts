"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createComment(data: {
  content: string;
  articleId: string;
  parentId?: string;
}) {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "لطفا ابتدا وارد حساب کاربری خود شوید",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isActive: true, role: true },
    });

    if (!user?.isActive) {
      return {
        success: false,
        message: "حساب کاربری شما غیرفعال است. لطفا با پشتیبانی تماس بگیرید",
      };
    }

    const article = await prisma.article.findUnique({
      where: { id: data.articleId },
    });

    if (!article) {
      return { success: false, message: "مقاله مورد نظر یافت نشد" };
    }

    const comment = await prisma.comment.create({
      data: {
        ...data,
        authorId: session.user.id,
        parentId: data.parentId ? data.parentId : null,
        isApproved: user?.role === "ADMIN" ? true : false,
      },
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
    });

    revalidatePath(`/articles/${article.slug}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, message: "خطا در ثبت نظر" };
  }
}

export async function getCommentsByArticleId(articleId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId,
        parentId: null,
        isApproved: true,
      },
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
          where: {
            isApproved: true,
          },
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
    });
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function getComments(approved?: boolean, userId?: string) {
  try {
    const whereClause: any = {};

    if (typeof approved === "boolean") {
      whereClause.isApproved = approved;
    }

    if (userId) {
      const session = await auth();
      if (!session?.user) {
        throw new Error("لطفا وارد حساب کاربری خود شوید");
      }
      if (session.user.id !== userId && session.user.role !== "ADMIN") {
        throw new Error("شما نمیتوانید نظرات دیگران را مشاهده کنید");
      }
      whereClause.authorId = userId;
    }

    const comments = await prisma.comment.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
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
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function approveComment(commentId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "لطفا ابتدا وارد حساب کاربری خود شوید" };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return { success: false, message: "شما نمیتوانید نظرات را تایید کنید" };
  }

  try {
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { isApproved: true },
    });
    return { success: true, comment };
  } catch (error) {
    console.error("Error approving comment:", error);
    return { success: false, message: "خطا در تایید نظر" };
  }
}

export async function deleteComment(
  commentIds: string[],
  isAdmin: boolean = false
) {
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "لطفا ابتدا وارد حساب کاربری خود شوید" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (isAdmin && user?.role !== "ADMIN") {
    return { success: false, message: "شما اجازه حذف نظرات را ندارید" };
  }

  const comments = await prisma.comment.findMany({
    where: { id: { in: commentIds } },
    select: { id: true, authorId: true, articleId: true },
  });

  if (comments.length === 0) {
    return { success: false, message: "هیچ نظری یافت نشد" };
  }

  if (!isAdmin) {
    const unauthorized = comments.some(
      (comment) => comment.authorId !== session.user.id
    );
    if (unauthorized) {
      return {
        success: false,
        message: "شما فقط می‌توانید نظرات خود را حذف کنید",
      };
    }
  }

  try {
    await prisma.comment.deleteMany({
      where: { id: { in: commentIds } },
    });

    const articleId = comments[0].articleId;
    revalidatePath(`/articles/${articleId}`);

    return { success: true, message: "نظر با موفقیت حذف شد" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { success: false, message: "خطا در حذف نظر" };
  }
}
