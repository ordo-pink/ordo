import { useTranslation } from "react-i18next"

import { EditorActivityState } from "$activities/editor/types"

import Unsupported from "$assets/img/not-supported-2.png"

import EditorPage from "$core/components/editor-page/editor-page"
import Null from "$core/components/null"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"

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
      image={Unsupported}
      imageAlt=""
    >
      {translatedText}
    </EditorPage>
  ))
}
