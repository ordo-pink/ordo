import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import ExtensionStoreExtension from "$activities/extension-store"

export default function FileNotSupported() {
  const { t } = useTranslation()

  const extensionStorePath = ExtensionStoreExtension.paths
    ? `/${ExtensionStoreExtension.paths[0]}`
    : "/extension-store"

  return (
    <div className="editor_not-supported">
      <div>{t("@ordo-activity-editor/unsupported-file")}</div>
      <div>
        <Link
          className="editor_not-supported_link"
          to={extensionStorePath}
        >
          {t("@ordo-activity-editor/search-for-extensions")}
        </Link>
      </div>
    </div>
  )
}
