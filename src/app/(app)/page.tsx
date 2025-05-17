import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ArticleCard from "@/components/app/articles/ArticleCard";
import PopularCategories from "@/components/app/home/PopularCategories";
import SearchForm from "@/components/app/home/SearchForm";
import { getArticles } from "../actions/articles";
import Link from "next/link";
import { Article } from "@/types/article";



export default async function Home() {
  const { articles } = await getArticles({
    limit: 9,
    sort: "newest",
  });

  return (
    <div className="container max-w-screen-lg mx-auto p-4">
      <section className="flex md:flex-col flex-col-reverse gap-10 md:py-20 items-center justify-center">
        <Badge variant="outline" className="text-xs md:text-sm hidden md:block">جدیدترین مقالات</Badge>
        <div className="flex flex-col md:items-center gap-4">
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2 md:gap-4">به<Image className="h-9 md:h-12 w-auto" src="/images/logo.svg" alt="Mini CMS" sizes="100vw" width={0} height={0} />خوش آمدید</h1>
          <p className="text-muted-foreground max-w-xl md:text-center leading-7 text-sm md:text-base">مقالیتو بستری برای خواندن، گفت‌وگو درباره‌ی موضوعات مورد علاقه و به اشتراک‌گذاری ایده‌های اصیل و عمیق در زندگی شخصی، حرفه‌ای و اجتماعی است.</p>
        </div>
        <SearchForm />
      </section>

      <section className="flex-wrap gap-4 pt-20 hidden md:flex">
        <PopularCategories />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-20">
        {articles.map((article: Article, index: number) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </section>

      <section className="flex flex-col gap-2 justify-center items-center text-center py-20">
        <LayoutGrid strokeWidth={1.5} className="text-blue-500 size-7 md:size-9" />
        <h3 className="text-xl md:text-2xl font-black">مقالات بیشتر</h3>
        <p className="text-muted-foreground text-sm md:text-base mb-4">می‌توانید از طریق لینک زیر به صفحه مقالات منتقل شوید</p>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/articles">
            مشاهده همه مقالات
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
