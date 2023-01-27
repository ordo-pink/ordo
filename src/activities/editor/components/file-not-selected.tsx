import { useTranslation } from "react-i18next"
import EditorPage from "./editor-page"
import NotSelected from "$assets/img/not-selected-3.png"

export default function FileNotSelected() {
  const { t } = useTranslation()

  const translatedText = t("@ordo-activity-editor/no-file")

  return (
    <EditorPage
      title=""
      image={NotSelected}
      imageAlt=""
    >
      <div className="text-4xl w-full flex flex-col items-center justify-center">
        {translatedText}
      </div>
    </EditorPage>
  )
}
