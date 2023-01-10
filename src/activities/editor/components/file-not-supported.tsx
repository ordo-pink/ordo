import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import ExtensionStoreExtension from "$activities/extension-store"

export default function FileNotSupported() {
  const extensionStorePath = ExtensionStoreExtension.paths
    ? `/${ExtensionStoreExtension.paths[0]}`
    : "/extension-store"

  const { t } = useTranslation()

  const translatedText = t("@ordo-activity-editor/unsupported-file")
  const translatedLink = t("@ordo-activity-editor/search-for-extensions")

  return (
    <div className="editor_not-supported">
      <div>{translatedText}</div>
      <div>
        <Link
          className="editor_not-supported_link"
          to={extensionStorePath}
        >
          {translatedLink}
        </Link>
      </div>
    </div>
  )
}
