import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"

export default createFileAssociationExtension("img", {
  Component: () => import("$file-associations/img/components"),
  Icon: () => import("$file-associations/img/components/icon"),
  fileExtensions: [
    ".apng",
    ".avif",
    ".gif",
    ".jpg",
    ".jpeg",
    ".pjpeg",
    ".pjp",
    ".svg",
    ".webp",
    ".bmp",
    ".ico",
    ".cur",
    ".tif",
    ".tiff",
    ".png",
  ],
  readableName: "@ordo-file-association-img/title",
  translations: {
    ru: {
      "@ordo-file-association-img/title":
        "Поддержка файлов .apng, .avif, .gif, .jpg, .jpeg, .pjpeg, .pjp, .svg, .webp, .bmp, .ico, .cur, .tif, .tiff, .png",
    },
    en: {
      "@ordo-file-association-img/title":
        "'.apng, .avif, .gif, .jpg, .jpeg, .pjpeg, .pjp, .svg, .webp, .bmp, .ico, .cur, .tif, .tiff, .png' file support",
    },
  },
})
