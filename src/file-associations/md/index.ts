import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"

export default createFileAssociationExtension("md", {
  Component: () => import("$file-associations/md/components"),
  Icon: () => import("$file-associations/md/components/icon"),
  fileExtensions: [".md"],
  readableName: "@ordo-file-association-md/title",
  translations: {
    ru: {
      "@ordo-file-association-md/title": "Поддержка файлов .md",
    },
    en: {
      "@ordo-file-association-md/title": "'.md' file support",
    },
  },
})
