"use client"

import { Button } from "@/components/ui/button";
import { formatAuthorName, formatCommentDate } from "@/lib/utils";
import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";
import CommentForm from "./CommentForm";
import { CommentItemProps } from "@/types/comments";

const CommentItem = ({ 
    id, 
    content, 
    createdAt, 
    author,
    replies = [], 
    onReply,
    isReply = false,
    isReplying,
    onReplyClick,
    replyingTo,
    parentId,
    isLoggedIn
}: CommentItemProps) => {
    const handleReply = async (content: string) => {
        await onReply(id, content, parentId);
    };

    return (
        <>
            <div className={`border p-4 rounded-lg space-y-4 ${isReply ? 'mr-8 md:mr-12' : ''}`}>
                <div className="flex items-center gap-2">
                    <Image 
                        className="rounded-full" 
                        src={author.image || "/images/default-avatar.jpg"} 
                        alt={formatAuthorName(author.firstName, author.lastName)} 
                        width={32} 
                        height={32} 
                    />
                    <div>
                        <p className="text-sm mb-1">{formatAuthorName(author.firstName, author.lastName)}</p>
                        <p className="text-xs text-muted-foreground">{formatCommentDate(createdAt)}</p>
                    </div>
                </div>
                <p className="text-sm">{content}</p>
                {isLoggedIn && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-muted-foreground hover:text-primary"
                        onClick={() => onReplyClick(id, parentId)}
                        aria-expanded={isReplying}
                        aria-controls={`reply-form-${id}`}
                    >
                        <MessageSquarePlus size={16} />
                        پاسخ
                    </Button>
                )}
            </div>
            {isReplying && (
                <div className="mr-8 md:mr-12">
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => onReplyClick(id, parentId)}
                        placeholder="پاسخ خود را بنویسید..."
                        submitText="ارسال پاسخ"
                        cancelText="انصراف"
                        isReply
                    />
                </div>
            )}
            {replies.length > 0 && (
                <div className="mr-8 md:mr-12 space-y-4">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            {...reply}
                            onReply={onReply}
                            isReply
                            isReplying={replyingTo[`${reply.id}`] === reply.id}
                            onReplyClick={onReplyClick}
                            replyingTo={replyingTo}
                            parentId={id}
                            isLoggedIn={isLoggedIn}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default CommentItem; 