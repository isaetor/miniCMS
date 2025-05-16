"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    router.push(`/articles?search=${formData.get("search")}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center w-full max-w-md">
      <Input type="text" name="search" className="w-full md:w-[250px]" placeholder="جستجوی در مقالیتو ..." />
      <Button type="submit" size="icon"><SearchIcon /></Button>
    </form>
  );
} 