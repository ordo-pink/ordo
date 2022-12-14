import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import ExtensionStoreExtension from "$activities/extension-store"

export default function FileNotSupported() {
  const { t } = useTranslation()

  const extensionStorePath = ExtensionStoreExtension.paths
    ? `/${ExtensionStoreExtension.paths[0]}`
    : "/extension-store"

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div>{t("@ordo-activity-editor/unsupported-file")}</div>
      <div>
        <Link
          className="hover:underline hover:text-purple-600 hover:dark:text-purple-400 transition-colors duration-300"
          to={extensionStorePath}
        >
          {t("@ordo-activity-editor/search-for-extensions")}
        </Link>
      </div>
    </div>
  )
}
