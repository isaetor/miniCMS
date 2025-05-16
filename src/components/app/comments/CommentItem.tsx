"use client"

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";
import CommentForm from "./CommentForm";

interface CommentItemProps {
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    replies?: Reply[];
    onReply: (commentId: number, content: string, parentId?: number) => void;
    isReply?: boolean;
    isReplying: boolean;
    onReplyClick: (replyId: number, parentId?: number) => void;
    replyingTo: { [key: string]: number | null };
    parentId?: number;
    isLoggedIn: boolean;
}

interface Reply {
    id: number;
    userName: string;
    content: string;
    createdAt: string;
    replies?: Reply[];
}

const CommentItem = ({ 
    id, 
    userName, 
    content, 
    createdAt, 
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
                        src="/images/default-avatar.jpg" 
                        alt={`${userName} کاربر`} 
                        width={32} 
                        height={32} 
                    />
                    <div>
                        <p className="text-sm mb-1">{userName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
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
                {isReplying && isLoggedIn && (
                    <CommentForm
                        onSubmit={handleReply}
                        onCancel={() => onReplyClick(id, parentId)}
                        placeholder="پاسخ خود را بنویسید..."
                        submitText="ارسال پاسخ"
                        isReply
                    />
                )}
            </div>
            {replies.length > 0 && (
                <div className="grid gap-4">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            {...reply}
                            onReply={onReply}
                            isReply
                            isReplying={replyingTo[`${id}-${reply.id}`] === reply.id}
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