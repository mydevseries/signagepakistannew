import type { Metadata } from "next";
import pagesData from "@/lib/pages-data.json";

const pagesMap = pagesData.pages as Record<
  string,
  { title: string; description: string; html: string }
>;
const homePage = pagesMap[""] || pagesMap["index.html"] || pagesMap["index"];

export const metadata: Metadata = {
  title: homePage?.title || "Signage Pakistan — The Art of Precision | Sign Manufacturer & Installer",
  description:
    homePage?.description ||
    "Signage Pakistan designs, manufactures and installs 3D channel letters, pylon signs, lightboxes, LED neon, wayfinding and architectural signage from a 110,000 sq. ft. facility.",
};

export default function Home() {
  return (
    <div
      style={{ display: "contents" }}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: homePage?.html || "" }}
    />
  );
}
