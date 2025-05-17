"use client";

import React, { useEffect, useState } from "react";
import { approveComment, getComments } from "@/app/actions/comments";
import Image from "next/image";
import { formatAuthorName, formatCommentDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, MessageCircleDashedIcon } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        firstName: string;
        lastName: string;
        image: string;
    };
}


export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            const res = await getComments(false);
            setComments(res as Comment[]);
        }
        fetchComments();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            setLoadingIds((prev) => [...prev, id]);
            const res = await approveComment(id);
            if (res.success) {
                setComments((prev) => prev.filter((c) => c.id !== id));
            }
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setLoadingIds((prev) => prev.filter((i) => i !== id));
        }
    };

    if (comments.length === 0) return (
        <div className="flex flex-col items-center justify-center gap-4 py-20"> 
            <MessageCircleDashedIcon size={48}/>
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-xl font-bold">نظرات در انتظار تایید</h1>
                <p className="text-muted-foreground">هیچ کامنتی در انتظار تایید وجود ندارد</p>
            </div>
        </div>
    )
    return (
        <div className="container mx-auto p-4">
            <h1 className="font-bold mb-4">نظرات در انتظار تایید</h1>
            <div className="grid gap-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-xl">
                        <p className="text-sm text-muted-foreground mb-4">{comment.content}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image
                                    className="rounded-full"
                                    src={comment.author.image || "/images/default-avatar.jpg"}
                                    alt={formatAuthorName(comment.author.firstName, comment.author.lastName)}
                                    width={32}
                                    height={32}
                                />
                                <div>
                                    <p className="text-sm mb-1">{formatAuthorName(comment.author.firstName, comment.author.lastName)}</p>
                                    <p className="text-xs text-muted-foreground">{formatCommentDate(comment.createdAt)}</p>
                                </div>
                            </div>

                            <Button
                                disabled={loadingIds.includes(comment.id)}
                                onClick={() => handleApprove(comment.id)}
                                variant="outline"
                            >
                                {loadingIds.includes(comment.id) ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                {loadingIds.includes(comment.id) ? "در حال تایید..." : "تایید"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
