import { ThunkFn } from "@ordo-pink/common-types"
import { useTranslation } from "react-i18next"
import { BsArrowRight } from "react-icons/bs"
import PricingPlanFeature from "./pricing-plan-feature"
import { OrdoButtonPrimary } from "../../../core/components/buttons"
import { PricingPlanFeatureItem } from "../types"

type Props = {
  title: string
  price: string
  description: string
  features: PricingPlanFeatureItem[]
  isAvailable: boolean
  isHighlighted: boolean
  onClick?: ThunkFn<void>
}

export default function PricingPlan({
  title,
  price,
  description,
  isAvailable,
  isHighlighted,
  onClick = () => void 0,
  features,
}: Props) {
  const { t } = useTranslation()

  const translatedTitle = t(title)
  const translatedPrice = t(price)
  const translatedDescription = t(description)
  const translatedComingSoon = t("@ordo-activity-pricing/coming-soon")
  const translatedChoosePlan = t("@ordo-activity-pricing/choose-plan")

  return (
    <div
      className={`flex flex-col space-y-2 w-72 lg:w-96 p-4 rounded-lg bg-gradient-to-tr ${
        isHighlighted
          ? "from-pink-300 via-rose-300 to-purple-300 dark:from-stone-900 dark:via-neutral-900 dark:to-sky-900 dark:shadow-lg"
          : "from-slate-200 via-neutral-200 to-stone-200 dark:from-stone-800 dark:via-neutral-800 dark:to-slate-800 dark:shadow-lg"
      }`}
    >
      <h2 className="text-2xl font-extrabold">{translatedTitle}</h2>
      <h3 className="text-xl font-bold">{translatedPrice}</h3>
      <p className="text-lg">{translatedDescription}</p>
      <div className="py-4">
        <ul className="flex flex-col space-y-2">
          {features.map((feature) => (
            <PricingPlanFeature
              key={feature.text}
              feature={feature}
            />
          ))}
        </ul>

        <div className="w-full flex items-center mt-8">
          {isAvailable ? (
            <OrdoButtonPrimary
              center
              inverted
              className="w-full uppercase font-semibold"
              onClick={onClick}
            >
              <div className="flex items-center space-x-2">
                <div>{translatedChoosePlan}</div>
                <BsArrowRight />
              </div>
            </OrdoButtonPrimary>
          ) : (
            <OrdoButtonPrimary
              center
              disabled
              className="w-full"
              onClick={onClick}
            >
              <div className="flex items-center space-x-2">{translatedComingSoon}</div>
            </OrdoButtonPrimary>
          )}
        </div>
      </div>
    </div>
  )
}
