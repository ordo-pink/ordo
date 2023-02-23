import { Fieldset, useWorkspace } from "@ordo-pink/react"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import DeleteAccountField from "./delete-account-field"
import EmailField from "./email-field"
import LogoutField from "./logout-field"
import PasswordField from "./password-field"
import { UsedSpace } from "./used-space"

export default function Settings() {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-user/title")

  return (
    <Workspace>
      <div className="w-full flex justify-center mt-20 p-4">
        <div className="w-full max-w-xl">
          <Helmet>
            <title>
              {"Ordo.pink | "}
              {translatedTitle}
            </title>
          </Helmet>

          <form className="flex flex-col space-y-4">
            <Fieldset>
              <div className="w-full">
                <UsedSpace />
              </div>
            </Fieldset>

            <EmailField />
            {/* <EmailVerifiedField /> */}
            <PasswordField />
            <LogoutField />
            <DeleteAccountField />
          </form>
        </div>
      </div>
    </Workspace>
  )
}
