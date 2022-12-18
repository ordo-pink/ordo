import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"

export default createFileAssociationExtension("md-viewer", {
  Component: () => import("$file-associations/md-viewer/components"),
  Icon: () => import("$file-associations/md-viewer/components/icon"),
  fileExtensions: [".md"],
  readableName: "@ordo-file-association-md-viewer/title",
  translations: {
    ru: {
      "@ordo-file-association-md-viewer/title": "Просмотр Markdown-файлов",
    },
    en: {
      "@ordo-file-association-md-viewer/title": "Markdown Viewer",
    },
  },
})
