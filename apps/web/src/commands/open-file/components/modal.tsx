import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { lazyBox, preventDefault, stopPropagation, noOp } from "@ordo-pink/fns"
import { IOrdoDirectory, IOrdoFile, OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null } from "@ordo-pink/react-utils"
import { Switch } from "@ordo-pink/switch"
import Fuse from "fuse.js"
import { useState, useEffect, ChangeEvent, KeyboardEvent, MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, createSearchParams } from "react-router-dom"
import OpenFileItem from "./open-file-item"
import { useModal } from "../../../containers/app/hooks/use-modal"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { useExtensionSelector } from "../../../core/state/hooks/use-extension-selector"
import { hideOpenFile } from "../store"
import { OpenFileExtensionStore } from "../types"

import "../index.css"

const getFiles = (directory: Nullable<IOrdoDirectory>, files: IOrdoFile[] = []) => {
  if (!directory) return files

  for (const item of directory.children) {
    if (OrdoDirectory.isOrdoDirectory(item)) {
      getFiles(item, files)
    } else {
      files.push(item)
    }
  }

  return files
}

const fuse = new Fuse([] as IOrdoFile[], { keys: ["readableName"] })

export default function OpenFile() {
  const dispatch = useAppDispatch()

  const openFileSelector = useExtensionSelector<OpenFileExtensionStore>()

  const root = useAppSelector((state) => state.app.personalProject)

  const isShown = openFileSelector((state) => state["ordo-command-open-file"].isShown)

  const { showModal, Modal } = useModal()

  const { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [visibleFiles, setVisibleFiles] = useState(getFiles(root))

  useEffect(() => {
    fuse.setCollection(getFiles(root))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root])

  useEffect(() => {
    if (inputValue === "") {
      return void setVisibleFiles(getFiles(root))
    }

    const fusedFiles = fuse.search(inputValue)

    setVisibleFiles(fusedFiles.map(({ item }) => item))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, root])

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown])

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const navigate = useNavigate()

  const handleEnter = lazyBox<KeyboardEvent<HTMLInputElement>>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(() => visibleFiles[currentIndex])
      .map((file) => {
        const association = fileAssociations.find((assoc) =>
          assoc.fileExtensions.includes(file.extension),
        )

        return createSearchParams({
          association: association ? association.name : "unsupported",
          path: file.path,
        })
      })
      .fold((searchParams) => {
        navigate({
          pathname: "/editor",
          search: searchParams.toString(),
        })

        handleHideModal()
      }),
  )

  const handleArrowUp = lazyBox((box) =>
    box
      .map(() => currentIndex === 0)
      // If it is the first item in the list, skip to the last item.
      .map((isFirstItem) =>
        Either.fromBoolean(isFirstItem).fold(
          () => currentIndex - 1,
          () => visibleFiles.length - 1,
        ),
      )
      .fold(setCurrentIndex),
  )

  const handleArrowDown = lazyBox((box) =>
    box
      .map(() => currentIndex === visibleFiles.length - 1)
      // If it is the last item in the list, skip to the first item.
      .map((isLastItem) =>
        Either.fromBoolean(isLastItem).fold(
          () => currentIndex + 1,
          () => 0,
        ),
      )
      .fold(setCurrentIndex),
  )

  const handleClick = lazyBox<IOrdoFile>((box) =>
    box
      .map((file) => {
        const association = fileAssociations.find((assoc) =>
          assoc.fileExtensions.includes(file.extension),
        )

        return createSearchParams({
          association: association ? association.name : "unsupported",
          path: file.path,
        })
      })
      .fold((searchParams) => {
        navigate({
          pathname: "/editor",
          search: searchParams.toString(),
        })

        handleHideModal()
      }),
  )

  const handleHideModal = () => {
    setCurrentIndex(0)
    setInputValue("")

    dispatch(hideOpenFile())
  }

  const handleModalClick = lazyBox<MouseEvent>((box) =>
    box.tap(preventDefault).tap(stopPropagation),
  )

  const handleChange = lazyBox<ChangeEvent<HTMLInputElement>>((box) =>
    box
      .map((e) => e.target)
      .map((t) => t.value)
      .map(setInputValue)
      .map(() => 0)
      .fold(setCurrentIndex),
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    Switch.of(event.key)
      .case("Escape", handleHideModal)
      .case("Enter", () => handleEnter(event))
      .case("ArrowUp", () => handleArrowUp(event))
      .case("ArrowDown", () => handleArrowDown(event))
      .default(noOp)

  const translatedPlaceholder = t(`@ordo-command-open-file/placeholder`)

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal onHide={handleHideModal}>
      <div className="open-file_overlay">
        <div
          role="none"
          className="open-file_modal"
          onClick={handleModalClick}
        >
          <input
            className="open-file_modal_input"
            autoFocus
            type="text"
            placeholder={translatedPlaceholder}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <div className="open-file_modal_command-container">
            {visibleFiles.map((file, index) => (
              <OpenFileItem
                key={file.path}
                file={file}
                onClick={handleClick}
                isCurrent={currentIndex === index}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  ))
}
