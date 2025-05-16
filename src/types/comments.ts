import { Session } from "next-auth";

export interface CommentAuthor {
    id: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
}

export interface BaseComment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    articleId: string;
    parentId: string | null;
    author: CommentAuthor;
    replies?: BaseComment[];
}

export interface ArticleComment extends BaseComment {
    replies?: BaseComment[];
}

export interface CommentItemProps {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    articleId: string;
    author: CommentAuthor;
    replies: CommentItemProps[];
    onReply: (commentId: string, content: string, parentId?: string) => void;
    isReply?: boolean;
    isReplying: boolean;
    onReplyClick: (replyId: string, parentId?: string) => void;
    replyingTo: { [key: string]: string | null };
    parentId?: string;
    isLoggedIn: boolean;
}

export interface CommentsProps {
    initialSession: Session | null;
    articleId: string;
} 