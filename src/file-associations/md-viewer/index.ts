import loadable from "@loadable/component"
import { BsFileEarmark } from "react-icons/bs"

import { OrdoFileAssociationExtension } from "$core/types"

const MdFileAssociation: OrdoFileAssociationExtension<"md-viewer"> = {
  Component: loadable(() => import("$file-associations/md-viewer/components")),
  Icon: BsFileEarmark,
  fileExtensions: [".md"],
  name: "ordo-file-association-md-viewer",
  readableName: "@ordo-file-association-md-viewer/title",
  translations: {
    ru: {
      "@ordo-file-association-md-viewer/title": "Установленные расширения",
    },
    en: {
      "@ordo-file-association-md-viewer/title": "All installed extensions",
    },
  },
}

export default MdFileAssociation
