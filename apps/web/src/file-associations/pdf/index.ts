import { createFileAssociationExtension } from "../../core/extensions/create-file-association-extension"
import { OrdoFileAssociationProps } from "../../core/types"

const pdf = createFileAssociationExtension("pdf", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  fileExtensions: [".pdf"],
  readableName: "@ordo-file-association-pdf/title",
  translations: {
    ru: {
      "@ordo-file-association-pdf/title": "Поддержка PDF файлов",
    },
    en: {
      "@ordo-file-association-pdf/title": "PDF files support",
    },
  },
})

export type PdfProps = OrdoFileAssociationProps<typeof pdf>

export default pdf
