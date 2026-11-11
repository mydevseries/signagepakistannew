import { Suspense, use } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import pagesData from "@/lib/pages-data.json";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const pagesMap = pagesData.pages as Record<
  string,
  { title: string; description: string; html: string; slug: string; filename: string }
>;

export function generateStaticParams() {
  return (pagesData.slugList as string[]).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const page = pagesMap[decoded] || pagesMap[decoded.replace(/\.html$/, "")];

  if (!page) {
    return {
      title: "Page Not Found | Signage Pakistan",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

function PageContent({ params }: PageProps) {
  const { slug } = use(params);
  const decoded = decodeURIComponent(slug);
  const page = pagesMap[decoded] || pagesMap[decoded.replace(/\.html$/, "")];

  if (!page) {
    notFound();
  }

  return (
    <div
      style={{ display: "contents" }}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: page.html }}
    />
  );
}

export default function DynamicPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <PageContent params={params} />
    </Suspense>
  );
}
