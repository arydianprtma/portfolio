import React from "react";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <PostForm isEditing={false} />
    </div>
  );
}
