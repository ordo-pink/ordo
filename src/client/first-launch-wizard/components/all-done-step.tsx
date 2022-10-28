import React from "react"
import { useTranslation } from "react-i18next"

export default function AllDoneStep() {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-5xl text-pink-500">{t("@first-launch-wizard/all-done")}</div>
    </div>
  )
}
