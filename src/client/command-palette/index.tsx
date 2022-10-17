import React, { useState, MouseEvent, KeyboardEvent, ChangeEvent, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Fuse from "fuse.js"

import { useModalWindow } from "@client/modal"
import { useAppDispatch, useAppSelector } from "@client/state"
import { identity } from "ramda"
import CommandPaletteItem from "./components/command-palette-item"
import { OrdoCommand } from "@core/types"

/**
 * This is required to let fuse search through translations, not original command keys.
 */
type SearchableCommand = OrdoCommand<string> & { title: `@${string}/${string}` }

const fuse = new Fuse([] as SearchableCommand[], { keys: ["title"] })

export const useCommandPaletteModal = () => {
  const { showModal, hideModal, Modal } = useModalWindow()

  return {
    showCommandPalette: showModal,
    hideCommandPalette: hideModal,
    CommandPalette: () => (
      <Modal>
        <CommandPalette hideModal={hideModal} />
      </Modal>
    ),
  }
}

type Props = {
  hideModal: (event?: MouseEvent) => void
}

const CommandPalette = ({ hideModal }: Props) => {
  const dispatch = useAppDispatch()

  // TODO: Add fuse
  const commands = useAppSelector((state) => state.app.commands)
  const state = useAppSelector(identity)
  const [visibleCommands, setVisibleCommands] = useState(commands)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useTranslation()

  const placeholder = t(`app.command-palette.placeholder`)

  const [inputValue, setInputValue] = useState("")

  const handleWrapperClick = (event: MouseEvent) => event.stopPropagation()

  useEffect(() => {
    const searchableCommands: SearchableCommand[] = commands.map((command) => ({
      ...command,
      title: t(command.title),
    }))

    fuse.setCollection(searchableCommands)
  }, [commands])

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
  }, [inputValue, commands])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

  const handleClick = (command: OrdoCommand<string>) => {
    dispatch(() => command.action(state, { dispatch, target: null }))
    hideModal()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      hideModal()
    } else if (e.key === "Enter") {
      const currentCommand = visibleCommands[currentIndex]
      dispatch(() => currentCommand.action(state, { dispatch, target: null }))
      hideModal()
    } else if (e.key === "ArrowUp") {
      const previousIndex = currentIndex === 0 ? visibleCommands.length - 1 : currentIndex - 1
      setCurrentIndex(previousIndex)
    } else if (e.key === "ArrowDown") {
      const nextIndex = currentIndex === visibleCommands.length - 1 ? 0 : currentIndex + 1
      setCurrentIndex(nextIndex)
    }
  }

  return (
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
  )
}
