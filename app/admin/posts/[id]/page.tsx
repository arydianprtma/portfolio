import React from "react";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/storage";
import { PostForm } from "@/components/admin/PostForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id: slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <PostForm initialData={post} isEditing={true} />
    </div>
  );
}
