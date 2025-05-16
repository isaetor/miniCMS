"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState } from "react";

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    placeholder?: string;
    submitText?: string;
    cancelText?: string;
    isReply?: boolean;
}

const CommentForm = ({ 
    onSubmit, 
    onCancel, 
    placeholder = "نظر خود را بنویسید...",
    submitText = "ارسال نظر",
    cancelText = "انصراف",
    isReply = false
}: CommentFormProps) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            await onSubmit(content);
            setContent("");
        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [content, onSubmit]);

    return (
        <form 
            className="border rounded-lg"
            onSubmit={handleSubmit}
        >
            <Textarea
                placeholder={placeholder}
                className="border-none rounded-none shadow-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                aria-label={isReply ? "Reply input" : "Comment input"}
            />
            <div className="p-2 flex justify-end gap-2">
                {isReply && onCancel && (
                    <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>
                )}
                <Button 
                    type="submit"
                    size={isReply ? "sm" : "default"}
                    className={!isReply ? "px-8" : ""}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'در حال ارسال...' : submitText}
                </Button>
            </div>
        </form>
    );
};

export default CommentForm; 