import { createFileAssociationExtension } from "../../core/extensions/create-file-association-extension"
import { OrdoFileAssociationProps } from "../../core/types"

export const md = createFileAssociationExtension("md", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
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

export type MdProps = OrdoFileAssociationProps<typeof md>

export default md
