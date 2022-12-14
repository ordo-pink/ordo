import loadable from "@loadable/component"
import { BsFileEarmark } from "react-icons/bs"

import { OrdoFileAssociationExtension } from "$core/types"

const IsmFileAssociation: OrdoFileAssociationExtension<"ism"> = {
  Component: loadable(() => import("$file-associations/ism/components")),
  Icon: BsFileEarmark,
  fileExtensions: [".ism"],
  name: "ordo-file-association-ism",
  readableName: "@ordo-file-association-ism/title",
  translations: {
    ru: {
      "@ordo-file-association-ism/title": "Поддержка файлов ISM",
    },
    en: {
      "@ordo-file-association-ism/title": "ISM Files Support",
    },
  },
}

export default IsmFileAssociation
