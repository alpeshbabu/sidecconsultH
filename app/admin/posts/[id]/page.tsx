import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostEditor } from "./PostEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  if (id === "new") {
    return { title: "New Post" };
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: post ? `Edit: ${post.title}` : "Edit Post",
  };
}

export default async function PostEditorPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";

  // Fetch post data if editing
  let post = null;
  if (!isNew) {
    const dbPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!dbPost) {
      notFound();
    }

    // Convert Date objects to ISO strings for the client component
    post = {
      ...dbPost,
      publishedAt: dbPost.publishedAt?.toISOString() ?? null,
      createdAt: dbPost.createdAt.toISOString(),
      updatedAt: dbPost.updatedAt.toISOString(),
    };
  }

  // Fetch categories for dropdown
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return (
    <PostEditor
      post={post}
      categories={categories}
      isNew={isNew}
    />
  );
}
