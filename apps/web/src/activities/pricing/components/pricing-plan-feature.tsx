import { useTranslation } from "react-i18next"
import { BsCheck2 } from "react-icons/bs"
import ComingSoonBadge from "../../../core/components/badge/coming-soon"
import { PricingPlanFeatureItem } from "../types"

type Props = {
  feature: PricingPlanFeatureItem
}

export default function PricingPlanFeature({ feature }: Props) {
  const { t } = useTranslation()

  const translatedText = t(feature.text)

  return (
    <li className="w-full flex items-center space-x-2">
      <BsCheck2 className="text-green-700" />

      {feature.comingSoon ? (
        <div className="w-full flex items-center justify-between">
          <div>{translatedText}</div>
          <ComingSoonBadge />
        </div>
      ) : (
        <div>{translatedText}</div>
      )}
    </li>
  )
}
