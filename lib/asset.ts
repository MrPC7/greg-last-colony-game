// Prefix a public/ asset path with the deploy base path (empty when served at the domain root).
// next/link handles basePath automatically; plain <img>, CSS url() and fetch() do not.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
