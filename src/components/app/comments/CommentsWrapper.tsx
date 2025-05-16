import Comments from "./index";
import { auth } from "@/lib/auth";

export default async function CommentsWrapper() {
    const session = await auth();
    return <Comments initialSession={session} />;
} 