import { PricingPlan } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import SupportField from "./components/support-field"
import logo from "../assets/logo.png"

/**
 * User area.
 */
export default function UserPage() {
  const { t } = useTranslation("ordo")

  const tFirstName = t("first-name")
  const tLastName = t("last-name")
  const tFirstNamePlaceholder = t("first-name-placeholder")
  const tLastNamePlaceholder = t("last-name-placeholder")
  // const tUsername = t("username")

  const tSubscriptionPlanTitle = t("subscription-plan-title")

  const freeFeatures = [t("free-feature-1"), t("free-feature-2"), t("free-feature-3")]
  const proFeatures = [t("pro-feature-1"), t("pro-feature-2"), t("pro-feature-3")]

  return (
    <div className="w-full p-4 flex flex-col items-center">
      <div className="w-full mt-16 p-8 flex flex-col space-y-8 items-center max-w-2xl rounded-lg shadow-lg bg-neutral-100 dark:bg-neutral-800">
        <div className="-mt-20 p-1 rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
          <img
            src={logo}
            alt="Ordo.pink Logo"
            className="h-32 rounded-full bg-white dark:bg-neutral-900"
          />
        </div>

        <div className="w-full flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
          <label className="w-full flex flex-col space-y-1 items-center">
            <div>{tFirstName}</div>
            <input
              className="w-full max-w-xs bg-neutral-200 dark:bg-neutral-900 rounded-lg px-2 py-1 text-lg shadow-inner"
              type="text"
              placeholder={tFirstNamePlaceholder}
            />
          </label>
          <label className="w-full flex flex-col space-y-1 items-center">
            <div>{tLastName}</div>
            <input
              className="w-full max-w-xs bg-neutral-200 dark:bg-neutral-900 rounded-lg px-2 py-1 text-lg shadow-inner"
              type="text"
              placeholder={tLastNamePlaceholder}
            />
          </label>
        </div>

        {/* <div className="w-full">
          <label className="w-full flex flex-col space-y-1 items-center">
            <div>{tUsername}</div>
            <div className="flex space-x-2 w-full bg-neutral-200 dark:bg-neutral-900 rounded-lg p-1 text-lg shadow-inner">
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2 shadow-sm">
                ordo.pink/@
              </div>
              <input
                className="w-full bg-transparent"
                type="text"
              />
            </div>
          </label>
        </div> */}

        <div className="w-full flex flex-col space-y-6 items-center">
          <h3 className="text-2xl font-extrabold">{tSubscriptionPlanTitle}</h3>

          <div className="w-full flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:justify-between">
            <PricingPlan
              features={freeFeatures}
              current
              available
              title="free"
              description="free-description"
              price="free-price"
            />

            <PricingPlan
              features={proFeatures}
              title="pro"
              description="pro-description"
              price="pro-price"
            />
          </div>

          {/* <div className="flex space-x-2 w-full bg-neutral-200 dark:bg-neutral-900 rounded-lg p-1 text-lg shadow-inner">
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2">ordo.pink/@</div>
              <input
                className="w-full bg-transparent"
                type="text"
              />
            </div> */}
        </div>
        <SupportField />
      </div>
    </div>
  )
}
