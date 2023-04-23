import { useTranslation } from "react-i18next"
import { IconType } from "react-icons/lib"

type Props = {
  title: string
  Icon: IconType
  description: string
}

export default function Feature({ title, Icon, description }: Props) {
  const { t } = useTranslation("home")

  return (
    <div className="relative pl-9">
      <dt className="inline font-semibold">
        <Icon className="absolute top-1 left-1 h-5 w-5 text-orange-700" />
        {t(title)}
      </dt>{" "}
      <dd className="inline text-neutral-600 dark:text-neutral-400">{t(description)}</dd>
    </div>
  )
}
