import { useTranslation } from "react-i18next"
import { IconType } from "react-icons/lib"

type Props = {
  title: string
  Icon: IconType
  description: string
}

export default function KeyPrinciple({ title, Icon, description }: Props) {
  const { t } = useTranslation("home")

  return (
    <div className="relative pl-16">
      <dt className="text-base font-semibold leading-7">
        <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-b shadow-md from-rose-700 to-pink-600">
          <Icon
            className="w-6 h-6 text-white"
            aria-hidden="true"
          />
        </div>
        {t(title)}
      </dt>
      <dd className="mt-2 text-base leading-7 text-neutral-600 dark:text-neutral-400">
        {t(description)}
      </dd>
    </div>
  )
}
