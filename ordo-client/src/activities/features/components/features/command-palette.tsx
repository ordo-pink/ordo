import { useTranslation } from "react-i18next"

import CommandPalette1 from "$activities/features/assets/command-palette-1.png"

export default function CommandPaletteFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/command-palette-title")
  const translatedText = t("@ordo-activity-features/command-palette-text")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

      <img
        className="rounded-lg w-full md:w-2/3 block shadow-lg"
        src={CommandPalette1}
        alt="Command Palette"
      />

      <div className="max-w-md">{translatedText}</div>
    </div>
  )
}
