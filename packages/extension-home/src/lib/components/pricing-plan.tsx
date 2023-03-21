import { OrdoButtonPrimary, useCommands } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsCheck2 } from "react-icons/bs"

type Props = {
  features: string[]
  title: string
  description: string
  price: string
}

export default function PricingPlan({ features, title, description, price }: Props) {
  const { t } = useTranslation("home")
  const { execute } = useCommands()

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
        <h3 className="text-2xl font-bold tracking-tight text-neutral-900">{tTitle}</h3>
        <p className="mt-6 text-base leading-7 text-neutral-600">{tDescription}</p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
            {tWhatsIncluded}
          </h4>
          <div className="h-px flex-auto bg-neutral-100" />
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-neutral-600 sm:grid-cols-2 sm:gap-6"
        >
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
        <div className="rounded-2xl bg-neutral-50 py-10 text-center ring-1 ring-inset ring-neutral-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="mx-auto max-w-xs px-8">
            <p className="text-base font-semibold text-neutral-600">{tPriceHeader}</p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-neutral-900">{tPrice}</span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-600">
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
            <p className="mt-6 text-xs leading-5 text-neutral-600">{tPriceFooter}</p>
          </div>
        </div>
      </div>
    </>
  )
}
