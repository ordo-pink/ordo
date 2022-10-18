import type { OrdoCommand } from "@core/types"

import React, { useState, MouseEvent, KeyboardEvent, ChangeEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { identity } from "ramda"
import Fuse from "fuse.js"

import { useModalWindow } from "@client/modal"
import { useAppDispatch, useAppSelector } from "@client/state"

import { hideCommandPalette } from "./store"
import { noOp } from "@core/utils/no-op"
import Either from "@core/utils/either"

import CommandPaletteItem from "@client/command-palette/components/command-palette-item"
import Null from "@client/null"
import Switch from "@core/utils/switch"

// This is required to let fuse search through translations, not original command keys.
type SearchableCommand = OrdoCommand<string> & { title: `@${string}/${string}` }

const fuse = new Fuse([] as SearchableCommand[], { keys: ["title"] })

/**
 * Command Palette provides access to all commands registerred by Ordo or its extensions.
 * Command Palette uses fuzzy search by translated command title.
 */
export default function CommandPalette() {
  const dispatch = useAppDispatch()

  const commands = useAppSelector((state) => state.commandPalette.commands)
  const isShown = useAppSelector((state) => state.commandPalette.isShown)
  const state = useAppSelector(identity)

  const { Modal, showModal, hideModal } = useModalWindow()
  const { t } = useTranslation()

  const [visibleCommands, setVisibleCommands] = useState(commands)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")

  const placeholder = t(`app.command-palette.placeholder`)

  useEffect(() => {
    if (isShown) showModal()
  }, [isShown])

  const handleWrapperClick = (event: MouseEvent) => event.stopPropagation()

  useEffect(() => {
    const searchableCommands: SearchableCommand[] = commands.map((command) => ({
      ...command,
      title: t(command.title),
    }))

    fuse.setCollection(searchableCommands)
  }, [commands, t])

  useEffect(() => {
    if (inputValue === "") {
      const searchableCommands: SearchableCommand[] = commands.map((command) => ({
        ...command,
        title: t(command.title),
      }))

      return setVisibleCommands(searchableCommands)
    }

    const fusedCommands = fuse.search(inputValue)

    setVisibleCommands(fusedCommands.map(({ item }) => item))
  }, [inputValue, commands, t])

  const hide = () => {
    hideModal()
    setCurrentIndex(0)
    setInputValue("")
    dispatch(hideCommandPalette())
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

  const handleClick = (command: OrdoCommand<string>) => {
    dispatch(() => command.action(state, { dispatch, target: null }))
    hide()
  }

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    const handle = Switch.of(key)
      .case("Escape", hide)
      .case("Enter", () => {
        const currentCommand = visibleCommands[currentIndex]
        dispatch(() => currentCommand.action(state, { dispatch, target: null }))
        hide()
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
    <Modal>
      <div className="h-full flex items-start justify-center">
        <div
          onClick={handleWrapperClick}
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
