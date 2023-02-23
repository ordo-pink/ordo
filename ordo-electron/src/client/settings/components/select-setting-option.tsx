import React from "react"
import { useTranslation } from "react-i18next"

type Props = {
  option: string
}

export default function SelectSettingOption({ option }: Props) {
  const { t } = useTranslation()
  const translatedOption = t(`app.${option}`)

  return <option value={option}>{translatedOption}</option>
}
