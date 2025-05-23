import { formatAuthorName, formatDate, formatContent } from "@/lib/utils";
import Image from "next/image";
import { Calendar, Layers2, MessagesSquare, Pencil } from "lucide-react";
import SecondArticleCard from "@/components/app/articles/SecondArticleCard";
import { getArticle, getSimilarArticles } from "@/app/actions/articles";
import { notFound } from "next/navigation";
import CommentsWrapper from "@/components/app/comments/CommentsWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const ArticlePage = async ({ params }: Props) => {
  const session = await auth();
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const similarArticles = await getSimilarArticles(
    article.id,
    article.categoryId
  );

  return (
    <div className="container mx-auto md:px-4">
      <Image
        src={article.image || "/images/default-article.jpg"}
        alt={article.title}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-[200px] md:h-[400px] object-cover md:rounded-xl md:mb-8"
      />
      <div className="relative max-w-screen-lg mx-auto py-4 md:p-0 rounded-t-xl bg-background -mt-4 md:mt-0 z-10">
        <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-4 px-4 mb-4">
          <h1 className="text-xl md:text-2xl font-black">{article.title}</h1>
          {article.author.id === session?.user?.id && (
            <Button className="w-full md:w-fit" variant="outline" asChild>
              <Link href={`/articles/new?slug=${article.slug}`}>
                ویرایش
                <Pencil className="size-4" />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex items-center overflow-x-auto gap-6 mb-8 px-4">
          <div className="flex items-center gap-2 shrink-0">
            <Image
              className="rounded-full"
              src={article.author.image || "/images/default-avatar.jpg"}
              alt="user"
              width={32}
              height={32}
            />
            <p className="text-sm">
              {formatAuthorName(
                article.author.firstName,
                article.author.lastName
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="size-8 bg-primary/10 text-primary rounded-full p-1 flex items-center justify-center">
              <Calendar size={16} />
            </div>
            {article.published && (
              <p className="text-sm">{formatDate(article.published)}</p>
            )}
          </div>
        </div>
        <div
          className="px-4 leading-9 text-foreground/70 h"
          dangerouslySetInnerHTML={{
            __html: formatContent(article.content),
          }}
        />
      </div>
      <div className="py-16 md:py-32 px-4">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Layers2
            strokeWidth={1.5}
            className="text-blue-500 size-7 md:size-9"
          />
          <h2 className="text-xl md:text-2xl font-black">مقالات مرتبط</h2>
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            مقالاتی که ممکن است دوست داشته باشید
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {similarArticles.map((article, index) => (
            <SecondArticleCard
              key={article.id}
              article={article}
              index={index}
            />
          ))}
        </div>
      </div>
      <div className="pt-16 md:pt-32 pb-4 px-4">
        <div className="flex flex-col items-center gap-2 mb-8">
          <MessagesSquare
            strokeWidth={1.5}
            className="text-blue-500 size-7 md:size-9"
          />
          <h3 className="text-xl md:text-2xl font-black">نظرات</h3>
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            دیدگاه ها و نظرات کاربران
          </p>
        </div>
        <div className="max-w-screen-md mx-auto">
          <CommentsWrapper articleId={article.id} />
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
