"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createOrUpdateArticle } from "@/app/actions/articles";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types/article";
import { deleteImage, uploadImage } from "@/app/actions/upload";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command } from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  BookPlus,
  Tag,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  _count?: {
    articles: number;
  };
}
type ArticleFormData = {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  image: string;
  categorySlug: string;
  status: "draft" | "published";
};

interface Props {
  initialArticle: Article | null;
  categories: Category[];
}

export default function ArticleForm({ initialArticle, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const defaultValues: ArticleFormData = {
    id: initialArticle?.id ?? "",
    title: initialArticle?.title ?? "",
    content: initialArticle?.content ?? "",
    excerpt: initialArticle?.excerpt ?? "",
    image: initialArticle?.image ?? "",
    categorySlug: initialArticle?.category?.slug ?? "uncategorized",
    status: initialArticle?.published ? "published" : "draft",
    slug: initialArticle?.slug ?? "",
  };

  const [article, setArticle] = useState<ArticleFormData>(defaultValues);

  useEffect(() => {
    if (pathname === "/articles/new" && !searchParams.has("slug")) {
      setArticle({
        id: "",
        title: "",
        content: "",
        excerpt: "",
        image: "",
        categorySlug: "uncategorized",
        status: "draft",
        slug: "",
      });
    }
  }, [pathname, searchParams]);

  const [status, setStatus] = useState({
    message: "",
    isLoading: false,
    error: false,
  });
  const [isPending, startTransition] = useTransition();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const autoSave = (field: keyof ArticleFormData, value: string) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    const updatedArticle = { ...article, [field]: value };
    setArticle(updatedArticle);

    setStatus({
      message: "در حال ذخیره...",
      isLoading: true,
      error: false,
    });
    saveTimeout.current = setTimeout(async () => {
      try {
        const result = await createOrUpdateArticle(updatedArticle);
        if (result.success) {
          setArticle((prev) => ({ ...prev, id: result.article!.id }));
          setStatus({ message: "ذخیره شد", isLoading: false, error: false });
          setTimeout(
            () => setStatus({ message: "", isLoading: false, error: false }),
            2000
          );
        } else {
          toast.error(result.message);
          setStatus({
            message: "خطا در ذخیره‌سازی",
            isLoading: false,
            error: true,
          });
        }
      } catch {
        toast.error("خطا در ذخیره‌سازی");
        setStatus({
          message: "خطا در ذخیره‌سازی",
          isLoading: false,
          error: true,
        });
      }
    }, 2000);
  };

  const publish = () => {
    setStatus({ message: "در حال انتشار...", isLoading: true, error: false });
    startTransition(async () => {
      try {
        await createOrUpdateArticle({ ...article, status: "published" });
        setStatus({ message: "منتشر شد", isLoading: false, error: false });
        setTimeout(() => {
          setStatus({ message: "", isLoading: false, error: false });
          router.push("/articles");
        }, 1500);
      } catch {
        setStatus({
          message: "خطا در انتشار مقاله",
          isLoading: false,
          error: true,
        });
      }
    });
  };
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleCategoryChange = (slug: string) => {
    const selectedCategory = categories.find((cat) => cat.slug === slug);
    if (!selectedCategory) return;
    autoSave("categorySlug", selectedCategory.slug);
    setArticle((prev) => ({
      ...prev,
      categorySlug: selectedCategory.slug,
    }));
  };

  const selectedCategory =
    categories.find((cat) => cat.slug === article.categorySlug)?.slug ?? null;

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
                ? categories.find(
                    (category) => category.slug === selectedCategory
                  )?.name
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
                    onSelect={() => handleCategoryChange(category.slug)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategory === category.slug
                          ? "opacity-100"
                          : "opacity-0"
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
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      selectedCategory === category.slug
                        ? "opacity-100"
                        : "opacity-0"
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

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between p-4">
        <CategorySelector />
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex items-center gap-1 text-xs md:text-sm",
                  status.error
                    ? "text-red-500"
                    : status.isLoading
                    ? "text-yellow-500"
                    : "text-green-500"
                )}
              >
                {status.isLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : status.error ? (
                  <X className="size-4" />
                ) : (
                  <Check className="size-4" />
                )}
                <span>{status.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button onClick={publish} disabled={isPending || status.isLoading}>
            {article.status === "published"
              ? "بروزرسانی مقاله"
              : "انتشار مقاله"}
            <BookPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="md:px-4">
        <div
          className="w-full max-w-full bg-accent md:bg-transparent h-[200px] md:h-[300px] md:border-2 border-dashed md:rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative md:mb-4"
          onClick={() => {
            inputFileRef.current?.click();
          }}
        >
          {!article.image ? (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground text-lg select-none">
              <Plus size={32} />
              تصویر مقاله را وارد کنید
            </div>
          ) : (
            <img
              src={article.image}
              alt="تصویر مقاله"
              className="object-cover w-full h-full"
            />
          )}

          {article.image && (
            <Button
              type="button"
              variant="destructive"
              className="absolute top-2 left-2"
              onClick={async (e) => {
                e.stopPropagation();
                setStatus({
                  message: "در حال حذف تصویر…",
                  isLoading: true,
                  error: false,
                });
                try {
                  const res = await deleteImage(article.image);
                  if (res.success) {
                    autoSave("image", "");
                    if (inputFileRef.current) {
                      inputFileRef.current.value = "";
                    }
                  } else {
                    setStatus({
                      message: res.message || "خطا در حذف تصویر",
                      isLoading: false,
                      error: true,
                    });
                  }
                } catch (error) {
                  console.error("Error deleting image:", error);
                  setStatus({
                    message: "خطا در حذف تصویر",
                    isLoading: false,
                    error: true,
                  });
                } finally {
                  setTimeout(
                    () =>
                      setStatus({
                        message: "",
                        isLoading: false,
                        error: false,
                      }),
                    2000
                  );
                }
              }}
            >
              حذف
            </Button>
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputFileRef}
            onChange={async (e) => {
              const fileInput = e.target;
              setStatus({
                message: "در حال آپلود تصویر...",
                isLoading: true,
                error: false,
              });
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              try {
                const res = await uploadImage(formData);
                if (res.success && res.imageUrl) {
                  autoSave("image", res.imageUrl);
                  setStatus({
                    message: "تصویر آپلود شد",
                    isLoading: false,
                    error: false,
                  });
                  setTimeout(
                    () =>
                      setStatus({
                        message: "",
                        isLoading: false,
                        error: false,
                      }),
                    2000
                  );
                } else {
                  setStatus({
                    message: res.message || "خطا در آپلود تصویر",
                    isLoading: false,
                    error: true,
                  });
                }
              } catch (error) {
                console.error("Error uploading image:", error);
                setStatus({
                  message: "خطا در آپلود تصویر",
                  isLoading: false,
                  error: true,
                });
              } finally {
                setTimeout(
                  () =>
                    setStatus({ message: "", isLoading: false, error: false }),
                  2000
                );
                fileInput.value = "";
              }
            }}
          />
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto p-4 -mt-4 md:mt-0 relative z-10 bg-background rounded-t-xl">
        <div className="mb-4 space-y-2">
          <Input
            placeholder="عنوان مقاله را وارد کنید"
            value={article.title}
            onChange={(e) => autoSave("title", e.target.value)}
            className="h-10 text-xl md:text-2xl font-black border-none shadow-none"
          />

          <Textarea
            placeholder="محتوای مقاله را وارد کنید"
            value={article.content}
            onChange={(e) => autoSave("content", e.target.value)}
            className="min-h-[500px] border-none shadow-none text-muted-foreground !leading-9"
          />
        </div>
        <Label htmlFor="excerpt">خلاصه مقاله</Label>
        <Textarea
          id="excerpt"
          placeholder="خلاصه مقاله را وارد کنید"
          value={article.excerpt}
          onChange={(e) => autoSave("excerpt", e.target.value)}
          className="min-h-[200px] text-muted-foreground !leading-9"
        />
      </div>
    </div>
  );
}
