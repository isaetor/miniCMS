import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface Author {
  id: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: Author;
  createdAt: string;
}

const SecondArticleCard = ({ article }: { article: Article }) => {
    return (
        <article className="bg-background rounded-2xl border relative overflow-hidden">
            <Link href={`/articles/${article.id}`} className="flex flex-col md:flex-row p-2" prefetch={false}>
                <Image
                    src={article.image}
                    alt={article.title}
                    width={300}
                    height={300}
                    className="h-38 w-full md:h-40 md:w-40 object-cover rounded-xl"
                    style={{ aspectRatio: "300/300", objectFit: "cover" }}
                    loading="lazy"
                    quality={85}
                />
                <div className="relative p-2 pt-4 md:pt-2 md:pr-4 flex flex-col justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold mb-2 line-clamp-2">
                            {article.title}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground leading-5 line-clamp-2">
                            {article.excerpt}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image 
                            className="rounded-full" 
                            src={article.author.image || "/images/default-avatar.jpg"} 
                            alt={article.author.firstName || "user"} 
                            width={32} 
                            height={32}
                            loading="lazy"
                        />
                        <div>
                            <p className="text-sm">
                                {article.author.firstName} {article.author.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    )
}

export default SecondArticleCard;