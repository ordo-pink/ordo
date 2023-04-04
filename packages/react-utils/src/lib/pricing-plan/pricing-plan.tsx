import { useTranslation } from "react-i18next"
import { BsCheck2 } from "react-icons/bs"
import { OrdoButtonPrimary } from "../buttons/buttons"
import { useCommands } from "../hooks/use-commands"

type Props = {
  features: string[]
  title: string
  description: string
  price: string
  available?: boolean
  pricePerUser?: boolean
}

export function PricingPlan({
  features,
  title,
  description,
  price,
  available = false,
  pricePerUser = false,
}: Props) {
  const { t } = useTranslation("home")
  const { emit: execute } = useCommands()

  const tTitle = t(title)
  const tPrice = t(price)
  const tGetStarted = t("get-started")
  const tComingSoon = t("coming-soon")
  const tCurrency = t("currency")
  const tCurrencyPerUser = t("currency-user")

  const handleGetStartedClick = () => execute("auth.register", "/")

  return (
    <div className="flex w-80 p-6 rounded-3xl self-stretch justify-between flex-col space-y-8 bg-gradient-to-t from-slate-100 to-stone-100 dark:from-zinc-800 dark:to-stone-800 border border-emerald-300 dark:border-emerald-700">
      <div className="flex flex-col space-y-4">
        <h4 className="text-xl font-bold">{tTitle}</h4>

        {tPrice ? (
          <div className="flex items-end">
            <h3 className="text-2xl font-black">{tPrice}</h3>
            <p className="text-lg font-bold">{pricePerUser ? tCurrencyPerUser : tCurrency}</p>
          </div>
        ) : null}

        <ul className="flex flex-col space-y-4">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex space-x-2 items-start"
            >
              <BsCheck2 className="text-emerald-500 text-xl shrink-0" />
              <div>{feature}</div>
            </li>
          ))}
        </ul>
      </div>
      <OrdoButtonPrimary
        disabled={!available}
        center
        onClick={handleGetStartedClick}
      >
        {available ? tGetStarted : tComingSoon}
      </OrdoButtonPrimary>
    </div>
  )
}
