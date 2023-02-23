import { createFileAssociationExtension, OrdoFileAssociationProps } from "@ordo-pink/extensions"

const img = createFileAssociationExtension("img", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
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
      "@ordo-file-association-img/title": "Поддержка изображений",
    },
    en: {
      "@ordo-file-association-img/title": "Image files support",
    },
  },
})

export type ImgProps = OrdoFileAssociationProps<typeof img>

export default img
