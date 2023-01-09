import Fuse from "fuse.js"
import { useState, useEffect, ChangeEvent, KeyboardEvent, MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import CommandPaletteItem from "$commands/command-palette/components/palette-item"
import { hideCommandPalette } from "$commands/command-palette/store"

import { AppSelectorExtension, SearchableCommand } from "$commands/command-palette/types"
import { useModal } from "$containers/app/hooks/use-modal"
import Null from "$core/components/null"

import { useActionContext } from "$core/hooks/use-action-context"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { OrdoCommand } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"
import { Switch } from "$core/utils/switch"

const fuse = new Fuse([] as SearchableCommand[], { keys: ["title"] })

export default function CommandPalette() {
  const dispatch = useAppDispatch()

  const root = useAppSelector((state) => state.app.personalProject)
  const commands = useAppSelector((state) => state.app.commands)
  const isShown = useAppSelector<AppSelectorExtension>(
    (state) => state["ordo-command-command-palette"].isShown,
  ) as boolean

  const actionContext = useActionContext(root)

  const { showModal, hideModal, Modal } = useModal()

  const { t } = useTranslation()

  const [visibleCommands, setVisibleCommands] = useState(
    commands.filter((command) => command.showInCommandPalette),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")

  const placeholder = t(`@ordo-command-command-palette/placeholder`)

  useEffect(() => {
    if (!isShown) showModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown])

  const handleWrapperClick = (event: MouseEvent) => event.stopPropagation()

  useEffect(() => {
    const searchableCommands: SearchableCommand[] = commands
      .filter((command) => command.showInCommandPalette)
      .map((command) => ({
        ...command,
        title: t(command.title),
      }))

    fuse.setCollection(searchableCommands)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands])

  useEffect(() => {
    if (inputValue === "") {
      const searchableCommands: SearchableCommand[] = commands
        .filter((command) => command.showInCommandPalette)
        .map((command) => ({
          ...command,
          title: t(command.title),
        }))

      return setVisibleCommands(searchableCommands)
    }

    const fusedCommands = fuse.search(inputValue)

    setVisibleCommands(fusedCommands.map(({ item }) => item))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, commands])

  const hide = () => {
    setCurrentIndex(0)
    setInputValue("")
    dispatch(hideCommandPalette())
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setCurrentIndex(0)
  }

  const handleClick = (command: OrdoCommand<string>) => {
    command.action(actionContext)

    hideModal()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const handle = Switch.of(event.key)
      .case("Escape", hide)
      .case("Enter", () => {
        event.preventDefault()
        event.stopPropagation()

        const currentCommand = visibleCommands[currentIndex]
        currentCommand && currentCommand.action(actionContext)

        hideModal()
      })
      .case("ArrowUp", () => {
        // If it is the first item, skip to the last item.
        const previousIndex = currentIndex === 0 ? visibleCommands.length - 1 : currentIndex - 1
        setCurrentIndex(previousIndex)
      })
      .case("ArrowDown", () => {
        // If it is the last item, skip to the first item.
        const nextIndex = currentIndex === visibleCommands.length - 1 ? 0 : currentIndex + 1
        setCurrentIndex(nextIndex)
      })
      .default(noOp)

    handle()
  }

  return Either.fromBoolean(isShown).fold(Null, () => (
    <Modal onHide={hide}>
      <div className="h-full flex items-start justify-center">
        <div
          onClick={handleWrapperClick}
          onKeyDown={() => void 0}
          role="button"
          tabIndex={-2}
          className="bg-neutral-100 dark:bg-neutral-700 shadow-xl rounded-md w-full max-w-2xl p-8 flex flex-col space-y-4 items-center"
        >
          <input
            className="w-full outline-none bg-white dark:bg-neutral-600 px-4 py-2"
            autoFocus
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <div className="w-full">
            {visibleCommands.map((command, index) => (
              <CommandPaletteItem
                key={command.title}
                command={command}
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
