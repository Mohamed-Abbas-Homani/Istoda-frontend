// app/story/[id]/page.tsx
"use client";
import React from "react";
import { use } from "react";
import Layout from "@/app/components/Layout/Layout";
import StoryReader from "@/app/components/StoryReader/StoryReader";

export default function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <Layout mode="protected">
      <StoryReader storyId={resolvedParams.id} />
    </Layout>
  );
}
