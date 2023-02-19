import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"
import PricingPlan from "./pricing-plan"
import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"
import { useActionContext } from "../../../core/hooks/use-action-context"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default function ExtensionStore() {
  const Workspace = useWorkspace()
  const actionContext = useActionContext()

  const commands = useAppSelector((state) => state.app.commands)
  const registerCommand = commands.find(
    (command) => command.title === "@ordo-command-auth/register",
  )

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-pricing/title")

  return (
    <Workspace>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <h1 className="text-center text-4xl font-black my-20">{translatedTitle}</h1>

      <div className="my-12 w-full flex flex-col flex-wrap space-y-8 md:flex-row md:space-y-0 md:space-x-8 items-center justify-center">
        <PricingPlan
          isAvailable
          isHighlighted
          title="@ordo-activity-pricing/free-title"
          price="@ordo-activity-pricing/free-price"
          description="@ordo-activity-pricing/free-description"
          onClick={() => registerCommand && registerCommand.action(actionContext)}
          features={[
            { text: "@ordo-activity-pricing/free-cloud-storage" },
            { text: "@ordo-activity-pricing/free-file-size" },
            { text: "@ordo-activity-pricing/free-invites", comingSoon: true },
            { text: "@ordo-activity-pricing/free-extensions", comingSoon: true },
            { text: "@ordo-activity-pricing/free-local-storage", comingSoon: true },
            { text: "@ordo-activity-pricing/free-self-hosting", comingSoon: true },
            { text: "@ordo-activity-pricing/free-cross-device-access", comingSoon: true },
          ]}
        />

        <PricingPlan
          isAvailable={false}
          isHighlighted={false}
          title="@ordo-activity-pricing/pro-title"
          price="@ordo-activity-pricing/pro-price"
          description="@ordo-activity-pricing/pro-description"
          features={[
            { text: "@ordo-activity-pricing/pro-everything-from-free" },
            { text: "@ordo-activity-pricing/pro-cloud-storage" },
            { text: "@ordo-activity-pricing/pro-file-size" },
            { text: "@ordo-activity-pricing/pro-invites" },
            { text: "@ordo-activity-pricing/pro-extensions" },
            { text: "@ordo-activity-pricing/pro-file-history" },
            { text: "@ordo-activity-pricing/pro-public-sharing" },
          ]}
        />
      </div>
    </Workspace>
  )
}
