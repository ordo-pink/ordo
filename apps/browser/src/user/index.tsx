import { OrdoButtonPrimary } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { BsCheck2 } from "react-icons/bs"
import logo from "../assets/logo.png"

export default function UserPage() {
  const { t } = useTranslation("ordo")

  const tFirstName = t("first-name")
  const tLastName = t("last-name")
  const tUsername = t("username")

  const tSubscriptionPlanTitle = t("subscription-plan-title")

  return (
    <div className="w-full p-4 flex flex-col items-center">
      <div className="w-full mt-16 p-8 flex flex-col space-y-8 items-center max-w-2xl rounded-lg shadow-lg bg-neutral-50 dark:bg-neutral-800">
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
            />
          </label>
          <label className="w-full flex flex-col space-y-1 items-center">
            <div>{tLastName}</div>
            <input
              className="w-full max-w-xs bg-neutral-200 dark:bg-neutral-900 rounded-lg px-2 py-1 text-lg shadow-inner"
              type="text"
            />
          </label>
        </div>

        <div className="w-full">
          <label className="w-full flex flex-col space-y-1 items-center">
            <div>{tUsername}</div>
            <div className="flex space-x-2 w-full bg-neutral-200 dark:bg-neutral-900 rounded-lg p-1 text-lg shadow-inner">
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2">ordo.pink/@</div>
              <input
                className="w-full bg-transparent"
                type="text"
              />
            </div>
          </label>
        </div>

        <div className="w-full flex flex-col space-y-6 items-center">
          <h3 className="text-2xl font-extrabold">{tSubscriptionPlanTitle}</h3>

          <div className="w-full flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:justify-between">
            <div className="flex w-72 p-4 rounded-lg self-stretch justify-between flex-col space-y-4 bg-gradient-to-tr from-slate-200 to-stone-200 dark:from-slate-700 dark:to-stone-700">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold">Free</h4>
                  <h4 className="text-xl font-black">0$/month</h4>
                </div>
                <ul>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                </ul>
              </div>
              <OrdoButtonPrimary
                disabled={true}
                onClick={() => void 0}
              >
                Current Plan
              </OrdoButtonPrimary>
            </div>

            <div className="flex w-72 p-4 rounded-lg self-stretch justify-between flex-col space-y-4 bg-gradient-to-tr from-slate-200 to-stone-200 dark:from-slate-700 dark:to-stone-700">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold">Pro</h4>
                  <h4 className="text-xl font-black">8$/month</h4>
                </div>
                <ul>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                  <li className="flex space-x-2 items-center">
                    <BsCheck2 className="text-emerald-500 text-xl" />
                    <div>feature 1</div>
                  </li>
                </ul>
              </div>
              <OrdoButtonPrimary onClick={() => void 0}>Change Plan</OrdoButtonPrimary>
            </div>
          </div>

          {/* <div className="flex space-x-2 w-full bg-neutral-200 dark:bg-neutral-900 rounded-lg p-1 text-lg shadow-inner">
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-2">ordo.pink/@</div>
              <input
                className="w-full bg-transparent"
                type="text"
              />
            </div> */}
        </div>
      </div>
    </div>
  )
}
