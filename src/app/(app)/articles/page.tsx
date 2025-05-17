import ArticleList from "@/components/app/articles/ArticleList";
import { Suspense } from "react";

const ArticlesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleList />
    </Suspense>
  );
};

export default ArticlesPage;