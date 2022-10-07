import { ORDO_FILE_EXTENSION } from "@core/app/constants"

// TODO: 73
export const FileAssociations: Record<string, string[]> = {
  image: [
    ".apng",
    ".avif",
    ".gif",
    ".jpg",
    ".jpeg",
    ".pgpeg",
    ".pjp",
    ".svg",
    ".webp",
    ".bmp",
    ".ico",
    ".cur",
    ".tif",
    ".tiff",
  ],
  ordo: [ORDO_FILE_EXTENSION],
  markdown: [".md", ".mdx"],
  // pdf: [".pdf"],
}
