import { useTranslation } from "react-i18next"
import { BsGithub } from "react-icons/bs"

export default function OpenSourceFeature() {
  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-features/open-source-title")
  const translatedText = t("@ordo-activity-features/open-source-text")
  const translatedLinks = t("@ordo-activity-features/links")

  return (
    <div className="flex h-full justify-center flex-col items-center space-y-8">
      <h2 className="font-extrabold text-3xl text-center">{translatedTitle}</h2>

      <div className="max-w-md">{translatedText}</div>

      <h3 className="self-start text-xl font-bold">{translatedLinks}</h3>

      <ul className="self-start">
        <li className="flex space-x-2 items-center">
          <BsGithub />

          <a
            href="https://github.com/ordo-pink"
            target="_blank"
            rel="noreferrer"
          >
            <div> {"Ordo Github"}</div>
          </a>
        </li>
        <li>
          <a
            href="https://spdx.org/licenses/Unlicense.html"
            target="_blank"
            rel="noreferrer"
          >
            {"The Unlicense"}
          </a>
        </li>
        <li>
          <a
            href="https://spdx.org/licenses/MIT.html"
            target="_blank"
            rel="noreferrer"
          >
            {"MIT License"}
          </a>
        </li>
      </ul>
    </div>
  )
}
