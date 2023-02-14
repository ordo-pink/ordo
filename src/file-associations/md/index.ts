import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"

export default createFileAssociationExtension("md", {
  Component: () => import("$file-associations/md/components"),
  Icon: () => import("$file-associations/md/components/icon"),
  fileExtensions: [".md"],
  readableName: "@ordo-file-association-md/title",
  translations: {
    ru: {
      "@ordo-file-association-md/title": "Поддержка файлов .md",
      "@ordo-file-association-md/size": "Размер",
      "@ordo-file-association-md/last-modified": "Последнее редактирование",
    },
    en: {
      "@ordo-file-association-md/title": "'.md' file support",
      "@ordo-file-association-md/size": "Size",
      "@ordo-file-association-md/last-modified": "Last Modified",
    },
  },
})
