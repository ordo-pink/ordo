import { useTranslation } from "react-i18next"
import { BsCheck2 } from "react-icons/bs"
import { OrdoButtonPrimary } from "../buttons/buttons"
import { useCommands } from "../hooks/use-commands"

type Props = {
  features: string[]
  title: string
  description: string
  price: string
}

export function PricingPlan({ features, title, description, price }: Props) {
  const { t } = useTranslation("home")
  const { emit: execute } = useCommands()

  const tTitle = t(title)
  const tDescription = t(description)
  const tPrice = t(price)
  const tPriceHeader = t("pricing-header")
  const tPriceFooter = t("price-footer")
  const tWhatsIncluded = t("pricing-whats-included")
  const tCurrency = t("pricing-currency")
  const tGetStarted = t("get-started")

  const handleGetStartedClick = () => execute("auth.register", "/")

  return (
    <>
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl font-bold tracking-tight">{tTitle}</h3>
        <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-400">
          {tDescription}
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
            {tWhatsIncluded}
          </h4>
          <div className="h-px flex-auto bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400 sm:grid-cols-2 sm:gap-6">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex gap-x-3"
            >
              <BsCheck2
                className="h-6 w-5 flex-none text-indigo-600"
                aria-hidden="true"
              />
              {t(feature)}
            </li>
          ))}
        </ul>
      </div>
      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
        <div className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 py-10 text-center ring-1 ring-inset ring-neutral-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="mx-auto max-w-xs px-8">
            <p className="text-base font-semibold text-neutral-600 dark:text-neutral-400">
              {tPriceHeader}
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-bold tracking-tight">{tPrice}</span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-600 dark:text-neutral-400">
                {tCurrency}
              </span>
            </p>
            <OrdoButtonPrimary
              inverted
              className="text-lg mt-10 px-16"
              onClick={handleGetStartedClick}
            >
              {tGetStarted}
            </OrdoButtonPrimary>
            <p className="mt-6 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
              {tPriceFooter}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
