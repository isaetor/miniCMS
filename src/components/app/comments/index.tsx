"use client"

import { useState } from "react";
import { Session } from "next-auth";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { LoginLink } from "@/components/auth/LoginLink";

interface Comment {
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    replies: Reply[];
}

interface Reply {
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    replies?: Reply[];
}

interface CommentsProps {
    initialSession: Session | null;
}

const Comments = ({ initialSession }: CommentsProps) => {
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            userName: "کاربر 1",
            content: "این یک نظر تستی است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
            createdAt: "2024/03/15",
            replies: [
                {
                    id: 4,
                    userName: "کاربر 2",
                    content: "این یک پاسخ تستی است.",
                    createdAt: "2024/03/15",
                    replies: []
                }
            ]
        },
        {
            id: 2,
            userName: "کاربر 2",
            content: "این یک نظر تستی است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
            createdAt: "2024/03/15",
            replies: []
        },
        {
            id: 3,
            userName: "کاربر 3",
            content: "این یک نظر تستی است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
            createdAt: "2024/03/15",
            replies: []
        }
    ]);

    const [replyingTo, setReplyingTo] = useState<{ [key: string]: number | null }>({});

    const handleCommentSubmit = async (content: string) => {
        // TODO: Implement API call to submit comment
        console.log('Submitting comment:', content);
    };

    const handleReplySubmit = (commentId: number, content: string, parentId?: number) => {
        // TODO: Implement API call to submit reply
        console.log('Submitting reply:', { commentId, content, parentId });

        // ایجاد پاسخ جدید
        const newReply: Reply = {
            id: Date.now(), // در حالت واقعی از API دریافت می‌شود
            userName: initialSession?.user?.firstName || "کاربر ناشناس", // در حالت واقعی از API دریافت می‌شود
            content,
            createdAt: new Date().toISOString(),
            replies: []
        };

        // به‌روزرسانی state
        setComments(prevComments => {
            if (!parentId) {
                // اگر پاسخ به کامنت اصلی است
                return prevComments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, replies: [...comment.replies, newReply] }
                        : comment
                );
            } else {
                // اگر پاسخ به یک پاسخ دیگر است
                return prevComments.map(comment => {
                    if (comment.id === parentId) {
                        return {
                            ...comment,
                            replies: comment.replies.map(reply =>
                                reply.id === commentId
                                    ? { ...reply, replies: [...(reply.replies || []), newReply] }
                                    : reply
                            )
                        };
                    }
                    return comment;
                });
            }
        });

        setReplyingTo({});
    };

    const handleReplyClick = (commentId: number, parentId?: number) => {
        if (!initialSession) return; // اگر کاربر وارد نشده، اجازه پاسخ نده
        const key = parentId ? `${parentId}-${commentId}` : `${commentId}`;
        setReplyingTo(prev => {
            if (prev[key] === commentId) {
                return {};
            }
            return { [key]: commentId };
        });
    };

    return (
        <div role="region" aria-label="Comments section" className="space-y-4">
            {initialSession && <CommentForm onSubmit={handleCommentSubmit} />}
            {!initialSession &&
                <div className="bg-accent flex flex-col items-center justify-center text-center gap-4 rounded-lg p-4">
                    <AlertCircle size={32} strokeWidth={1.5} />
                    <div>
                        <h2 className="font-bold mb-2">امکان ثبت دیدگاه وجود ندارد</h2>
                        <p className="text-sm text-muted-foreground">برای ثبت دیدگاه خود ابتدا باید وارد حساب کاربری خود شوید.</p>
                    </div>
                    <LoginLink variant="outline">
                        ورود به حساب کاربری
                    </LoginLink>
                </div>
            }
            <div className="grid gap-4">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        {...comment}
                        onReply={handleReplySubmit}
                        isReplying={replyingTo[`${comment.id}`] === comment.id}
                        onReplyClick={(replyId, parentId) => handleReplyClick(replyId, parentId)}
                        replyingTo={replyingTo}
                        isLoggedIn={!!initialSession}
                    />
                ))}
            </div>
        </div>
    );
};

export default Comments; 