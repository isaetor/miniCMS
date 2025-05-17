"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import { containsInappropriateContent } from "@/lib/inappropriate-words";

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    placeholder?: string;
    submitText?: string;
    cancelText?: string;
    isReply?: boolean;
}

const MAX_CONTENT_LENGTH = 1000;
const MIN_CONTENT_LENGTH = 3;

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
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const trimmedContent = content.trim();
        const isContentValid = 
            trimmedContent.length >= MIN_CONTENT_LENGTH && 
            trimmedContent.length <= MAX_CONTENT_LENGTH && 
            !containsInappropriateContent(trimmedContent);
        setIsValid(isContentValid);
    }, [content]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedContent = content.trim();
        
        if (!trimmedContent) {
            toast.error("لطفا نظر خود را وارد کنید");
            return;
        }

        if (trimmedContent.length < MIN_CONTENT_LENGTH) {
            toast.error(`نظر شما باید حداقل ${MIN_CONTENT_LENGTH} کاراکتر باشد`);
            return;
        }

        if (trimmedContent.length > MAX_CONTENT_LENGTH) {
            toast.error(`نظر شما نمی‌تواند بیشتر از ${MAX_CONTENT_LENGTH} کاراکتر باشد`);
            return;
        }

        if (containsInappropriateContent(trimmedContent)) {
            toast.error("لطفا از کلمات نامناسب استفاده نکنید");
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit(trimmedContent);
            setContent("");
        } catch (error) {
            console.error('Error submitting:', error);
            toast.error("خطا در ثبت نظر");
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
                minLength={MIN_CONTENT_LENGTH}
                maxLength={MAX_CONTENT_LENGTH}
                required
            />
            <div className="p-2 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    {content.length}/{MAX_CONTENT_LENGTH}
                </span>
                <div className="flex gap-2">
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
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting ? 'در حال ارسال...' : submitText}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm; 