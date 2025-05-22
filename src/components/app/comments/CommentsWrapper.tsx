import Comments from "./index";
import { auth } from "@/lib/auth";

export default async function CommentsWrapper({
  articleId,
}: {
  articleId: string;
}) {
  const session = await auth();
  return <Comments initialSession={session} articleId={articleId} />;
}
