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
            return { success: false, message: "لطفا ابتدا وارد حساب کاربری خود شوید" };
        }

        // Check if user is active
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { isActive: true }
        });

        if (!user?.isActive) {
            return { success: false, message: "حساب کاربری شما غیرفعال است. لطفا با پشتیبانی تماس بگیرید" };
        }

        // Check if article exists
        const article = await prisma.article.findUnique({
            where: { id: data.articleId }
        });

        if (!article) {
            return { success: false, message: "مقاله مورد نظر یافت نشد" };
        }

        const comment = await prisma.comment.create({
            data: {
                ...data,
                authorId: session.user.id
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

export async function getComments(articleId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                articleId,
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
        
export async function approveComment(commentId: string, sessionUserId: string) {
    // Check if the user is admin
    const user = await prisma.user.findUnique({
        where: { id: sessionUserId },
        select: { role: true }
    });
    if (!user || user.role !== "ADMIN") {
        return { success: false, message: "دسترسی غیرمجاز" };
    }
    try {
        const comment = await prisma.comment.update({
            where: { id: commentId },
            data: { isApproved: true },
        });
        return { success: true, comment };
    } catch (error) {
        return { success: false, message: "خطا در تایید دیدگاه" };
    }
} 