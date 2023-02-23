import { useTranslation } from "react-i18next"
import { BsCheck2 } from "react-icons/bs"

import RichEditor1 from "../../assets/rich-editor-1.png"
import RichEditor2 from "../../assets/rich-editor-2.png"

export default function RichTextEditorFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/rich-text-editor-title")
  const translatedText = t("@ordo-activity-features/rich-text-editor-text")
  const translatedMarkdownShortcuts = t("@ordo-activity-features/markdown-shortcuts")
  const translatedCheckableListItems = t("@ordo-activity-features/checkable-list-items")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

      <div className="flex flex-col space-y-2 items-center justify-center md:flex-row md:space-y-0 md:space-x-2">
        <img
          className="rounded-lg w-full md:w-2/5 block shadow-lg"
          src={RichEditor1}
          alt="Rich Editor Dark Mode"
        />

        <img
          className="rounded-lg w-full md:w-2/5 block shadow-lg"
          src={RichEditor2}
          alt="Rich Editor Dark Mode"
        />
      </div>

      <div className="max-w-md">{translatedText}</div>

      <ul>
        <li className="flex space-x-2 items-center">
          <BsCheck2 className="text-emerald-700 dark:text-emerald-400" />
          <div>{translatedMarkdownShortcuts}</div>
        </li>
        <li className="flex space-x-2 items-center">
          <BsCheck2 className="text-emerald-700 dark:text-emerald-400" />
          <div>{translatedCheckableListItems}</div>
        </li>
      </ul>
    </div>
  )
}
