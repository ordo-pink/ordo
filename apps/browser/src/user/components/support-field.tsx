import { OrdoButtonPrimary, useCommands } from "@ordo-pink/react-utils"
import { useTranslation } from "react-i18next"
import { AiOutlineMail } from "react-icons/ai"
import { BsTelegram } from "react-icons/bs"

export default function SupportField() {
  const { t } = useTranslation("ordo")
  const { emit } = useCommands()

  const translatedSupport = t("support")
  const translatedSupportEmail = t("support-email")
  const translatedSupportTelegram = t("support-telegram")

  const handleButtonEmailClick = () => {
    emit("ordo.support-email")
  }

  const handleButtonTelegramClick = () => {
    emit("ordo.support-telegram")
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center text-2xl font-extrabold">
        {translatedSupport}
      </div>

      <div className="flex justify-center items-center space-x-6 pt-4">
        <OrdoButtonPrimary
          onClick={handleButtonEmailClick}
          center
        >
          <div className="flex flex-row items-center space-x-2">
            <AiOutlineMail />
            <div className="flex items-center">{translatedSupportEmail}</div>
          </div>
        </OrdoButtonPrimary>
        <OrdoButtonPrimary
          onClick={handleButtonTelegramClick}
          center
        >
          <div className="flex flex-row items-center space-x-2">
            <BsTelegram />
            <div className="flex items-center">{translatedSupportTelegram}</div>
          </div>
        </OrdoButtonPrimary>
      </div>
    </div>
  )
}
