import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback-project-id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2023-01-01",
  useCdn: true,
});

let builder: any = null;
try {
  builder = imageUrlBuilder(client);
} catch {
  builder = null;
}

/** Sanity画像 or 文字列URL を安全にURL化。ダメならプレースホルダーへ */
export function urlForImage(src: any, w: number = 1200): string {
  try {
    if (typeof src === "string") {
      // http/https または / で始まる静的パスだけを許可
      if (src.startsWith("http") || src.startsWith("/")) return src;
      return "/images/placeholder.jpg";
    }
    
    // builderが初期化されていない場合やSanity未設定の場合
    if (!builder || !src || !src.asset || projectId === 'fallback-project-id') {
      return "/images/placeholder.jpg";
    }
    
    return builder.image(src as SanityImageSource).width(w).url();
  } catch {
    return "/images/placeholder.jpg";
  }
}
