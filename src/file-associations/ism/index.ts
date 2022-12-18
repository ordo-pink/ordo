import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"

export default createFileAssociationExtension("ism", {
  Component: () => import("$file-associations/ism/components"),
  Icon: () => import("$file-associations/ism/components/icon"),
  fileExtensions: [".ism"],
  readableName: "@ordo-file-association-ism/title",
  translations: {
    ru: {
      "@ordo-file-association-ism/title": "Поддержка файлов .ism",
    },
    en: {
      "@ordo-file-association-ism/title": "'.ism' file support",
    },
  },
})
