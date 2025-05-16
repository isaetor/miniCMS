"use client";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
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
      <Link href={`/articles/${article.id}`} className="">
        <Image 
          className="absolute inset-0 object-cover w-full h-full" 
          src={article.image} 
          alt={article.title} 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          width={800}
          height={600}
          loading="lazy"
          quality={85}
        />
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white rounded-t-xl w-fit p-1.5 pb-0">
              <div className="bg-blue-100 text-blue-500 rounded-md px-4 text-xs leading-7">
                {article.category}
              </div>
            </div>
            <div className="bg-white rounded-tl-xl rounded-bl-xl p-4">
              <h2 className="text-sm md:text-base font-bold mb-2 line-clamp-2">{article.title}</h2>
              <p className="text-xs text-muted-foreground leading-5 line-clamp-2 md:line-clamp-3">{article.description}</p>
            </div>
            <div className="bg-white rounded-b-xl w-fit p-1.5 pt-0 pl-6">
              <div className="flex items-center gap-2">
                <Image 
                  className="rounded-full" 
                  src="/images/default-avatar.jpg" 
                  alt="user" 
                  width={32} 
                  height={32}
                  loading="lazy"
                />
                <div>
                  <p className="text-sm">{article.author}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(article.date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;