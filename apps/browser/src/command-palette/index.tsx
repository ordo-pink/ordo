import { CommandPaletteItem, Nullable } from "@ordo-pink/common-types"
import { noOp } from "@ordo-pink/fns"
import {
  ActionListItem,
  useModal,
  useSubscription,
  useCommandPalette,
} from "@ordo-pink/react-utils"
import { hideCommandPalette } from "@ordo-pink/stream-command-palette"
import { hideModal } from "@ordo-pink/stream-modals"
import { Switch } from "@ordo-pink/switch"
import Fuse from "fuse.js"
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import { BsSearch } from "react-icons/bs"
import { Observable } from "rxjs"

type Props = {
  items: CommandPaletteItem[]
}

const fuse = new Fuse([] as CommandPaletteItem[], { keys: ["name"] })

const CommandPaletteModal = ({ items }: Props) => {
  const { hideCommandPalette } = useCommandPalette()

  const { t } = useTranslation("ordo")

  useHotkeys("Esc", hideCommandPalette)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [visibleItems, setVisibleItems] = useState<CommandPaletteItem[]>([])

  useEffect(() => {
    fuse.setCollection(items)
  }, [items])

  useEffect(() => {
    if (!items) return
    if (inputValue === "") {
      setVisibleItems(items)
      return
    }

    const fusedItems = fuse.search(inputValue)

    setVisibleItems(fusedItems.map(({ item }) => item))
  }, [inputValue, items])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const selectedItem = visibleItems[currentIndex]
    setInputValue("")

    selectedItem.onSelect()
  }

  const handleArrowUp = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const isFirstItem = currentIndex === 0

    setCurrentIndex(isFirstItem ? visibleItems.length - 1 : currentIndex - 1)
  }

  const handleArrowDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const isLastItem = currentIndex === visibleItems.length - 1

    setCurrentIndex(isLastItem ? 0 : currentIndex + 1)
  }

  const handleEscape = () => {
    setInputValue("")
    hideCommandPalette()
    hideModal()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    Switch.of(event.key)
      .case("Escape", () => handleEscape())
      .case("Enter", () => handleEnter(event))
      .case("ArrowUp", () => handleArrowUp(event))
      .case("ArrowDown", () => handleArrowDown(event))
      .default(noOp)
  }

  const tSearchPlaceholder = t("search-placeholder")

  return (
    <div className="w-[35rem] max-w-full h-[35rem] max-h-screen">
      <div className="flex space-x-2 items-center mx-2 mt-2 px-2 py-1 bg-neutral-200 dark:bg-neutral-600 rounded-lg shadow-inner">
        <BsSearch className="shrink-0" />
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          autoFocus
          className="w-full rounded-lg text-lg px-1 bg-transparent"
          placeholder={tSearchPlaceholder}
        />
      </div>

      <div className="px-2 py-4 overflow-y-auto h-[32rem]">
        {visibleItems.map(({ id, name, Icon, Comment, onSelect }, index) => (
          <ActionListItem
            key={id}
            text={name}
            Icon={Icon || (() => null)}
            isCurrent={currentIndex === index}
            onClick={onSelect}
            isLarge
          >
            {Comment ? <Comment /> : null}
          </ActionListItem>
        ))}
      </div>
    </div>
  )
}

export const useDefaultCommandPalette = (
  commandPalette$: Observable<Nullable<CommandPaletteItem[]>>,
) => {
  const items = useSubscription(commandPalette$)
  const { showModal, hideModal } = useModal()

  useEffect(() => {
    if (!items) {
      return hideModal()
    }

    showModal(() => <CommandPaletteModal items={items} />, {
      showCloseButton: false,
      onHide: () => hideCommandPalette(),
    })

    return () => {
      hideModal()
    }
  }, [items, showModal, hideModal])

  return null
}
