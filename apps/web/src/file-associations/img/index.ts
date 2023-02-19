import { createFileAssociationExtension } from "../../core/extensions/create-file-association-extension"
import { OrdoFileAssociationProps } from "../../core/types"

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
