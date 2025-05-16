"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Check, ChevronsUpDown, FileSearch, ListFilter, Search, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategories } from "@/app/actions/categories";
import { getArticles } from "@/app/actions/articles";
import SecondArticleCard from "@/components/app/articles/SecondArticleCard";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
}

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  category: Category;
  author: Author;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  publishedAt: string | null;
  slug: string;
  categoryId: string;
  authorId: string;
}

const convertDatesToStrings = (article: any): Article => ({
  ...article,
  createdAt: article.createdAt.toISOString(),
  updatedAt: article.updatedAt.toISOString(),
  publishedAt: article.publishedAt?.toISOString() || null,
});

const ArticlesPage = () => {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isFiltering, setIsFiltering] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });
  const router = useRouter();

  const fetchArticles = async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await getArticles({
        page: pageNum,
        sort: sortBy as 'newest' | 'oldest' | 'title',
        search: searchQuery,
        category: selectedCategory,
      });

      const articlesWithStringDates = data.articles.map(convertDatesToStrings);

      if (pageNum === 1) {
        setArticles(articlesWithStringDates);
      } else {
        setArticles((prev) => [...prev, ...articlesWithStringDates]);
      }

      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      alert("done");
      setLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    setIsFiltering(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setTimeoutId(setTimeout(() => {
      handleFilterClick("search", searchText);
    }, 1000));
  }, [searchText]);

  useEffect(() => {
    setIsFiltering(true);
    setPage(1);
    fetchArticles(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
    { value: "title", label: "عنوان (الف-ی)" },
  ];

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
      fetchArticles(page + 1);
    }
  }, [inView, hasMore, loading]);


  const handleFilterClick = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "clear") {
      params.delete("search");
      params.delete("category");
      params.delete("sort");
      setSearchQuery("");
      setSearchText("");
      setSelectedCategory("");
      setSortBy("newest");
    }
    if (type === "search") {
      if (value !== "") {
        params.set("search", value);
        setSearchQuery(value);
      } else {
        params.delete("search");
        setSearchQuery("");
        setSearchText("");
      }
    }
    if (type === "category") {
      if (value !== "") {
        params.set("category", value);
        setSelectedCategory(value);
      } else {
        params.delete("category");
        setSelectedCategory("");
      }
    }
    if (type === "sort") {
      if (value !== "") {
        params.set("sort", value);
        setSortBy(value);
      } else {
        params.delete("sort");
        setSortBy("newest");
      }
    }

    router.push(`?${params.toString()}`);
  };

  const CategorySelector = () => {
    if (isDesktop) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between"
            >
              {selectedCategory
                ? categories.find((category) => category.slug === selectedCategory)?.name
                : "انتخاب دسته‌بندی..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="جستجو در دسته‌بندی..." />
              <CommandEmpty>دسته‌بندی یافت نشد.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => {
                      handleFilterClick("category", category.slug);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.slug ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>انتخاب دسته‌بندی</SheetTitle>
            </SheetHeader>
            <div>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleFilterClick("category", category.slug)}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      selectedCategory === category.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.name}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  const SortSelector = () => {
    if (isDesktop) {
      return (
        <Select dir="rtl" value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon">
              <ListFilter className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>مرتب‌سازی مقالات</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-6">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleFilterClick("sort", option.value)}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      sortBy === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </Button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 grid gap-4">

      <div className="flex flex-row-reverse items-center gap-4">
        <CategorySelector />
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="جستجو در مقالات..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <SortSelector />
      </div>

      {(searchQuery || selectedCategory || sortBy !== "newest") && (
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-sm text-muted-foreground shrink-0">فیلترهای فعال:</span>
          {searchQuery && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm shrink-0">
              <span>جستجو: {searchQuery}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterClick("search", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {selectedCategory && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm shrink-0">
              <span>دسته‌بندی: {categories.find(c => c.slug === selectedCategory)?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterClick("category", "")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {sortBy !== "newest" && (
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm shrink-0">
              <span>مرتب‌سازی: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleFilterClick("sort", "newest")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground shrink-0"
            onClick={() => {
              handleFilterClick("clear", "");
            }}
          >
            حذف همه فیلترها
          </Button>
        </div>
      )}

      {articles.length > 0 && !isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <SecondArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>)
        :
        !loading && !isFiltering && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileSearch className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">مقاله‌ای یافت نشد</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {searchQuery ?
                `نتیجه‌ای برای "${searchQuery}" یافت نشد. لطفاً عبارت دیگری را امتحان کنید.` :
                selectedCategory ?
                  `مقاله‌ای در دسته‌بندی "${selectedCategory}" یافت نشد.` :
                  "در حال حاضر مقاله‌ای برای نمایش وجود ندارد."}
            </p>
          </div>
        )}
      {loading || isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(page == 1 ? 12 : 6)].map((_, index) => (
            <div key={index} className="bg-background rounded-2xl border relative overflow-hidden">
              <div className="flex flex-col md:flex-row p-2">
                <Skeleton className="h-38 w-full md:h-40 md:w-40 rounded-xl" />
                <div className="relative p-2 pt-4 md:pt-2 md:pr-4 flex flex-col justify-between gap-4">
                  <div>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : ""}


      {!isFiltering && (
        <div ref={ref} className="h-10" />
      )}
    </div>
  );
};

export default ArticlesPage;