import { Either } from "@ordo-pink/either"
import { lazyBox, stopPropagation, preventDefault } from "@ordo-pink/fns"
import { OrdoFilePath } from "@ordo-pink/fs-entity"
import { Null, OrdoButtonPrimary, OrdoButtonSecondary, PathBreadcrumbs } from "@ordo-pink/react"
import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsPalette2 } from "react-icons/bs"
import { useModal } from "../../../containers/app/hooks/use-modal"
import { updateDirectoryMetadata } from "../../../containers/app/store"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { hideModal } from "../store"
import { ColorExtensionStore } from "../types"

export default function RenameModal() {
  const dispatch = useAppDispatch()

  const { showModal, Modal } = useModal()

  const fsSelector = useExtensionSelector<ColorExtensionStore>()

  const isShown = fsSelector((state) => state["ordo-command-colors"].isShown)
  const target = fsSelector((state) => state["ordo-command-colors"].target)

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-command-colors/change-directory-color")
  const translatedCancel = t("@ordo-command-colors/button-cancel")
  const translatedOk = t("@ordo-command-colors/button-ok")

  const translatedNeutral = t("@ordo-command-colors/neutral")
  const translatedPink = t("@ordo-command-colors/pink")
  const translatedRed = t("@ordo-command-colors/red")
  const translatedOrange = t("@ordo-command-colors/orange")
  const translatedYellow = t("@ordo-command-colors/yellow")
  const translatedGreen = t("@ordo-command-colors/green")
  const translatedBlue = t("@ordo-command-colors/blue")
  const translatedPurple = t("@ordo-command-colors/purple")

  const [color, setColor] = useState("neutral")

  useEffect(() => {
    if (target && target.metadata.color) {
      setColor(target.metadata.color)
    }
  }, [target])

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line
  }, [isShown])

  const handleHide = lazyBox((box) =>
    box.map(() => setColor("neutral")).fold(() => dispatch(hideModal())),
  )

  const handleSelectChange = lazyBox<ChangeEvent<HTMLSelectElement>>((box) =>
    box
      .map((event) => event.target)
      .map((target) => target.value as OrdoFilePath)
      .fold(setColor),
  )

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(stopPropagation).fold(preventDefault),
  )

  const handleCancelButtonClick = lazyBox((box) =>
    box.tap(handleHide).fold(() => dispatch(hideModal())),
  )

  const handleOkButtonClick = lazyBox((box) =>
    box
      .tap(handleHide)
      .map(() => target && dispatch(updateDirectoryMetadata({ ...target, metadata: { color } })))
      .fold(() => dispatch(hideModal())),
  )

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(target))
    .fold(Null, (directory) => (
      <Modal onHide={handleHide}>
        <div className="h-full flex items-center justify-center">
          <div
            onClick={handleModalClick}
            className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-lg p-8 flex flex-col space-y-4 items-center"
            role="none"
          >
            <div className="flex items-center space-x-4 text-xl">
              <BsPalette2 className="shrink-0" />
              <div>{translatedTitle}</div>
            </div>

            <PathBreadcrumbs path={directory.path} />

            <select
              value={color}
              onChange={handleSelectChange}
              className="w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2"
            >
              <option value="neutral">{translatedNeutral}</option>
              <option value="pink">{translatedPink}</option>
              <option value="red">{translatedRed}</option>
              <option value="orange">{translatedOrange}</option>
              <option value="yellow">{translatedYellow}</option>
              <option value="green">{translatedGreen}</option>
              <option value="blue">{translatedBlue}</option>
              <option value="purple">{translatedPurple}</option>
            </select>

            <div className="w-full flex items-center justify-around">
              <OrdoButtonSecondary
                hotkey="escape"
                onClick={handleCancelButtonClick}
              >
                {translatedCancel}
              </OrdoButtonSecondary>

              <OrdoButtonPrimary
                hotkey="enter"
                disabled={!color}
                onClick={handleOkButtonClick}
              >
                {translatedOk}
              </OrdoButtonPrimary>
            </div>
          </div>
        </div>
      </Modal>
    ))
}
