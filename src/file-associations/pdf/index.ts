import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"

export default createFileAssociationExtension("pdf", {
  Component: () => import("$file-associations/pdf/components"),
  Icon: () => import("$file-associations/pdf/components/icon"),
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
