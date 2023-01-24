import { useTranslation } from "react-i18next"

import { EditorExtensionStore } from "$activities/editor/types"

import Unsupported from "$assets/img/not-supported-2.png"

import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"

export default function FileNotSupported() {
  const editorSelector = useExtensionSelector<EditorExtensionStore>()

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const { t } = useTranslation()

  const translatedText = t("@ordo-activity-editor/unsupported-file", {
    extension: currentFile?.extension,
  })

  return (
    <div className="editor_not-supported">
      <div className="relative w-full h-screen flex items-center justify-center">
        <img
          src={Unsupported}
          className="w-5/6 max-w-lg shadow-xl absolute rounded-md"
          alt=""
        />

        <div className="absolute w-1/2 break-words text-right text-9xl mix-blend-difference uppercase font-black">
          {translatedText}
        </div>
      </div>
    </div>
  )
}
