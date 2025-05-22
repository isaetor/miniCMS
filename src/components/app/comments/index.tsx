"use client";

import { useEffect, useState, useCallback } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { AlertCircle } from "lucide-react";
import { LoginLink } from "@/components/auth/LoginLink";
import { getCommentsByArticleId, createComment } from "@/app/actions/comments";
import { toast } from "sonner";
import {
  ArticleComment,
  CommentItemProps,
  CommentsProps,
} from "@/types/comments";

const Comments = ({ initialSession, articleId }: CommentsProps) => {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [isReplying, setIsReplying] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<Record<string, string>>({});

  const fetchComments = useCallback(async () => {
    try {
      const comments = await getCommentsByArticleId(articleId);
      console.log(comments);
      setComments(comments as ArticleComment[]);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("خطا در دریافت نظرات");
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (content: string) => {
    try {
      const result = await createComment({
        content,
        articleId,
      });
      if (result.success) {
        if (initialSession?.user.role === "ADMIN" && result.comment) {
          toast.success("دیدگاه شما با موفقیت ثبت شد");
          setComments([...comments, result.comment as ArticleComment]);
        } else {
          toast.success(
            "دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد"
          );
        }
      } else {
        toast.error(result.message || "خطا در ثبت دیدگاه");
      }
    } catch (error) {
      toast.error("خطا در ثبت دیدگاه");
    }
  };

  const handleReply = async (
    parentId: string,
    content: string,
    replyToParentId?: string
  ) => {
    try {
      const result = await createComment({
        content,
        articleId,
        parentId: replyToParentId || parentId,
      });

      if (result.success) {
        if (initialSession?.user.role === "ADMIN" && result.comment) {
          toast.success("پاسخ شما با موفقیت ثبت شد");
          setComments([...comments, result.comment as ArticleComment]);
        } else {
          toast.success(
            "پاسخ شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد"
          );
        }
        setIsReplying({});
      } else {
        toast.error(result.message || "خطا در ثبت پاسخ");
      }
    } catch (error) {
      toast.error("خطا در ثبت پاسخ");
    }
  };

  const handleReplyClick = (commentId: string, parentId?: string) => {
    setIsReplying((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    if (parentId) {
      setReplyingTo((prev) => ({
        ...prev,
        [commentId]: parentId,
      }));
    }
  };

  const transformCommentToCommentItemProps = useCallback(
    (comment: ArticleComment): CommentItemProps => {
      const { parentId: _, ...rest } = comment;
      return {
        ...rest,
        onReply: handleReply,
        isReplying: isReplying[comment.id],
        onReplyClick: handleReplyClick,
        replyingTo,
        isLoggedIn: !!initialSession,
        replies: (comment.replies || []).map((reply) => {
          const { parentId: __, ...replyRest } = reply;
          const replyKey = `${comment.id}-${reply.id}`;
          return {
            ...replyRest,
            onReply: handleReply,
            isReplying: isReplying[replyKey],
            onReplyClick: (replyId) => handleReplyClick(replyId, comment.id),
            replyingTo,
            parentId: comment.id,
            isLoggedIn: !!initialSession,
            replies: (reply.replies || []).map(
              (nestedReply: ArticleComment) => {
                const { parentId: ___, ...nestedReplyRest } = nestedReply;
                const nestedReplyKey = `${reply.id}-${nestedReply.id}`;
                return {
                  ...nestedReplyRest,
                  onReply: handleReply,
                  isReplying: isReplying[nestedReplyKey],
                  onReplyClick: (replyId) =>
                    handleReplyClick(replyId, reply.id),
                  replyingTo,
                  parentId: reply.id,
                  isLoggedIn: !!initialSession,
                  replies: [],
                };
              }
            ),
          };
        }),
      };
    },
    [handleReply, handleReplyClick, initialSession, isReplying, replyingTo]
  );

  return (
    <div role="region" aria-label="Comments section" className="space-y-4">
      {initialSession ? (
        <CommentForm onSubmit={handleSubmit} />
      ) : (
        <div className="bg-accent flex flex-col items-center justify-center text-center gap-4 rounded-lg p-4">
          <AlertCircle size={32} strokeWidth={1.5} />
          <div>
            <h2 className="font-bold mb-2">امکان ثبت دیدگاه وجود ندارد</h2>
            <p className="text-sm text-muted-foreground">
              برای ثبت دیدگاه خود ابتدا باید وارد حساب کاربری خود شوید.
            </p>
          </div>
          <LoginLink variant="outline">ورود به حساب کاربری</LoginLink>
        </div>
      )}
      <div className="grid gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            {...transformCommentToCommentItemProps(comment)}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
