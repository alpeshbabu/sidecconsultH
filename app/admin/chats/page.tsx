import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatsContent } from "./ChatsContent";

export const metadata: Metadata = {
  title: "Chat Transcripts",
  description: "View AI chatbot conversations and transcripts",
};

export default function AdminChatsPage() {
  return (
    <Suspense fallback={<ChatsLoading />}>
      <ChatsContent />
    </Suspense>
  );
}

function ChatsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
