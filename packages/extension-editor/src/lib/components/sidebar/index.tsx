import { IOrdoFile } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { noOp } from "@ordo-pink/fns"
import { Null, useContextMenu, useDrive, useCommands } from "@ordo-pink/react-utils"
import { Switch } from "@ordo-pink/switch"
import Fuse from "fuse.js"
import { memo, MouseEvent } from "react"
import { useState, ChangeEvent, useEffect, KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import { BsSearch } from "react-icons/bs"
import File from "./file"
import FileOrDirectory from "./file-or-directory"

const fuse = new Fuse([] as IOrdoFile[], { keys: ["readableName"] })

function FileExplorer() {
  const drive = useDrive()
  const { showContextMenu } = useContextMenu()
  const { emit, after, off } = useCommands()
  const { t } = useTranslation("editor")

  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [visibleFiles, setVisibleFiles] = useState<IOrdoFile[]>([])

  const resetInput = () => setInputValue("")

  useEffect(() => {
    after("editor.open-file-in-editor", resetInput)

    return () => {
      off("editor")("open-file-in-editor", resetInput)
    }
  }, [])

  useEffect(() => {
    if (!drive) return

    fuse.setCollection(drive.root.getFilesDeep())
  }, [drive])

  useEffect(() => {
    if (!drive) return
    if (inputValue === "") setVisibleFiles([])

    const fusedFiles = fuse.search(inputValue)

    setVisibleFiles(fusedFiles.map(({ item }) => item))
  }, [inputValue, drive])

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!drive) return

    showContextMenu({ x: event.pageX, y: event.pageY, target: drive.root })
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const selectedFile = visibleFiles[currentIndex]
    setInputValue("")

    emit("editor.open-file-in-editor", selectedFile.path)
  }

  const handleArrowUp = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const isFirstItem = currentIndex === 0

    setCurrentIndex(isFirstItem ? visibleFiles.length - 1 : currentIndex - 1)
  }

  const handleArrowDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const isLastItem = currentIndex === visibleFiles.length - 1

    setCurrentIndex(isLastItem ? 0 : currentIndex + 1)
  }

  const handleEscape = () => {
    setInputValue("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    Switch.of(event.key)
      .case("Escape", () => handleEscape())
      .case("Enter", () => handleEnter(event))
      .case("ArrowUp", () => handleArrowUp(event))
      .case("ArrowDown", () => handleArrowDown(event))
      .default(noOp)

  const tSearchFilePlaceholder = t("search-file-placeholder")

  return Either.fromNullable(drive).fold(Null, ({ root }) => (
    <div
      className="p-4 h-full"
      onContextMenu={handleContextMenu}
    >
      <div className="mx-auto flex items-center pl-2 mt-2 mb-4 rounded-lg bg-neutral-300 dark:bg-neutral-700 shadow-inner max-w-xs">
        <BsSearch />
        <input
          type="text"
          aria-autocomplete="none"
          className="w-full px-2 py-1 bg-transparent"
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          placeholder={tSearchFilePlaceholder}
        />
      </div>
      <div className="file-explorer_files-container">
        <div className="h-full">
          {inputValue
            ? visibleFiles.map((file, index) => (
                <File
                  isSelected={currentIndex === index}
                  key={file.path}
                  file={file}
                />
              ))
            : root.children.map((child) => (
                <FileOrDirectory
                  key={child.path}
                  item={child}
                />
              ))}
        </div>
      </div>
      {/* <UsedSpace />
      <div className="file-explorer_action-group">
        <OrdoButtonNeutral onClick={handleCreateFileClick}>
          <div>
            <CreateFileIcon />
          </div>
        </OrdoButtonNeutral>
        <OrdoButtonNeutral onClick={handleCreateDirectoryClick}>
          <div>
            <CreateDirectoryIcon />
          </div>
        </OrdoButtonNeutral>
      </div> */}
    </div>
  ))
}

export default memo(FileExplorer, () => true)
