"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const articlesCount = await prisma.article.count();
  const usersCount = await prisma.user.count();
  const approvedCommentsCount = await prisma.comment.count({
    where: { isApproved: true },
  });
  const pendingCommentsCount = await prisma.comment.count({
    where: { isApproved: false },
  });

  return { articlesCount, usersCount, approvedCommentsCount, pendingCommentsCount };
}