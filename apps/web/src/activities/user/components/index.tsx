import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import DeleteAccountField from "./delete-account-field"
import EmailField from "./email-field"
import LogoutField from "./logout-field"
import PasswordField from "./password-field"
import { UsedSpace } from "./used-space"
import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"
import EditorPage from "../../../core/components/editor-page/editor-page"
import Fieldset from "../../../core/components/fieldset"
import { useActionContext } from "../../../core/hooks/use-action-context"

export default function Settings() {
  const Workspace = useWorkspace()

  const { t } = useTranslation()

  const { userData } = useActionContext()

  const translatedTitle = t("@ordo-activity-user/title")

  return (
    <Workspace>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <EditorPage
        title={userData?.username}
        breadcrumbsPath={`/${translatedTitle}/`}
      >
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
      </EditorPage>
    </Workspace>
  )
}
