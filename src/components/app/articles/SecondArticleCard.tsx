"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatAuthorName } from "@/lib/utils";
import { ArticleCardProps } from "@/types/article";

const SecondArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <div className="bg-background rounded-2xl border relative overflow-hidden">
            <Link href={`/articles/${article.slug}`} className="flex flex-col md:flex-row p-2">
                <div className="relative shrink-0">
                    <Image
                        className="h-38 w-full md:h-40 md:w-40 rounded-xl object-cover"
                        src={article.image || "/images/default-article.jpg"}
                        alt={article.title}
                        width={300}
                        height={400}
                        loading="lazy"
                        quality={100}
                    />
                    <div className="absolute top-1 right-1 text-center bg-primary text-background rounded-lg px-4 text-xs pb-1 leading-6">
                        {article.category.name}
                    </div>
                </div>
                <div className="relative p-2 pt-4 md:pt-2 md:pr-4 flex flex-col justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold mb-2 line-clamp-2">{article.title}</h2>
                        <p className="text-xs text-muted-foreground leading-5 line-clamp-2">{article.excerpt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            className="rounded-md"
                            src={article.author.image || "/images/default-avatar.jpg"}
                            alt={formatAuthorName(article.author.firstName, article.author.lastName)}
                            width={32}
                            height={32}
                            loading="lazy"
                        />
                        <div>
                            <p className="text-sm">{formatAuthorName(article.author.firstName, article.author.lastName)}</p>
                            {article.published && <p className="text-xs text-muted-foreground">{formatDate(article.published)}</p>}
                        </div>
                    </div>
                </div>
            </Link >
        </div >
    );
};

export default SecondArticleCard;