"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDate, formatAuthorName } from "@/lib/utils";
import { motion } from "motion/react";
import { ArticleCardProps } from "@/types/article";

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.2 : 0 }}
      className="relative h-[400px] rounded-2xl overflow-hidden shadow-md"
    >
      <Link href={`/articles/${article.slug}`} className="">
        <Image 
          className="absolute inset-0 object-cover w-full h-full" 
          src={article.image || "/images/default-article.jpg"} 
          alt={article.title} 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          width={300}
          height={400}
          loading="lazy"
          quality={100}
        />
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-white rounded-t-xl w-fit p-1 pb-0">
            <div className="bg-primary text-background rounded-lg px-4 text-xs pb-1 leading-6">
              {article.category.name}
            </div>
          </div>
          <div className="bg-white rounded-tl-xl rounded-bl-xl p-4">
            <h2 className="text-sm md:text-base font-bold mb-2 line-clamp-2">{article.title}</h2>
            <p className="text-xs text-muted-foreground leading-5 line-clamp-2 md:line-clamp-3">{article.excerpt}</p>
          </div>
          <div className="bg-white rounded-b-xl w-fit p-1.5 pt-0 pl-6">
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
                <p className="text-xs mb-1">{formatAuthorName(article.author.firstName, article.author.lastName)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;