import { IOrdoFile } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { noOp } from "@ordo-pink/fns"
import { Null, useContextMenu, useDrive, useCommands } from "@ordo-pink/react-utils"
import { Switch } from "@ordo-pink/switch"
import Fuse from "fuse.js"
import { memo, MouseEvent } from "react"
import { useState, ChangeEvent, useEffect, KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import { BsFillPatchCheckFill, BsSearch, BsThreeDotsVertical } from "react-icons/bs"
import File from "./file"
import FileOrDirectory from "./file-or-directory"
import UsedSpace from "./used-space"
import logo from "../../assets/logo.png"

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
      className="py-4 h-full flex flex-col space-y-4"
      onContextMenu={handleContextMenu}
    >
      <div className="px-4 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            className="w-10"
            alt="Ordo.pink Logo"
          />
          <div className="text-neutral-500 cursor-pointer">
            {/* TODO: onClick show command palette */}
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="self-center flex items-center pl-2 rounded-lg bg-neutral-300 dark:bg-neutral-700 shadow-inner w-full max-w-sm">
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
      </div>
      <div className="px-4 overflow-y-auto h-[calc(100vh-12.5rem)] flex-grow">
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
      <div className="flex items-center space-x-4 w-full max-w-xs self-center justify-center px-4">
        <div className="rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0">
          <div className="bg-white rounded-full">
            <img
              src={logo}
              alt="User avatar"
              className="w-10 rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col text-sm text-neutral-700 w-full -mt-1">
          <div className="flex space-x-2 items-center">
            <div className="font-bold truncate">Sergei Orlov</div>
            <div className="shrink-0">
              <BsFillPatchCheckFill className="text-indigo-500 text-base" />
            </div>
          </div>
          <div className="w-full">
            <UsedSpace />
            {/* <div className="file-explorer_action-group">
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
        </div>
      </div>
    </div>
  ))
}

export default memo(FileExplorer, () => true)
