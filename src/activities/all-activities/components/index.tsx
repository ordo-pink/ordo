import { useTranslation } from "react-i18next"

export default function AllActivities() {
  const { t } = useTranslation()

  return <div>{t("@ordo-activity-all-activities/title")}</div>
}
