import { Either } from "@ordo-pink/either"
import { Null } from "@ordo-pink/react-components"
import { useTranslation } from "react-i18next"
import EditorPage from "../../../core/components/editor-page/editor-page"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { EditorActivityState } from "../types"

export default function FileNotSupported() {
  const editorSelector = useExtensionSelector<EditorActivityState>()

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const { t } = useTranslation()

  const translatedText = t("@ordo-activity-editor/unsupported-file", {
    extension: currentFile?.extension,
  })

  return Either.fromNullable(currentFile).fold(Null, () => (
    <EditorPage
      title="ERRR"
      imageAlt=""
    >
      {translatedText}
    </EditorPage>
  ))
}
