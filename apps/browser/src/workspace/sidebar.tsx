import { UnaryFn } from "@ordo-pink/common-types"
import { useCommandPalette, useSubscription } from "@ordo-pink/react-utils"
import { commandPaletteItems$ } from "@ordo-pink/stream-command-palette"
import { MouseEvent, PropsWithChildren } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { BsFillPatchCheckFill, BsThreeDotsVertical } from "react-icons/bs"
import UsedSpace from "./used-space"
import logo from "../assets/logo.png"

import "./sidebar.css"

type Props = PropsWithChildren<{
  onClick: UnaryFn<MouseEvent, void>
}>

export default function Sidebar({ children, onClick }: Props) {
  const { showCommandPalette } = useCommandPalette()
  const commandPaletteItems = useSubscription(commandPaletteItems$)

  useHotkeys(
    "ctrl+shift+p",
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      showCommandPalette(commandPaletteItems)
    },
    { enableOnContentEditable: true },
    [commandPaletteItems],
  )

  return (
    <div
      className="sidebar"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <img
          src={logo}
          className="w-10"
          alt="Ordo.pink Logo"
        />
        <div
          className="text-neutral-500 cursor-pointer"
          onClick={() => showCommandPalette(commandPaletteItems)}
        >
          {/* TODO: onClick show command palette */}
          <BsThreeDotsVertical />
        </div>
      </div>
      <div className="flex-grow">{children}</div>
      <div className="flex items-center space-x-4 w-full max-w-sm self-center justify-center">
        <div className="rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
          <div className="bg-white rounded-full">
            <img
              src={logo}
              alt="User avatar"
              className="w-10 rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col text-sm text-neutral-700 dark:text-neutral-400 w-full -mt-1">
          <div className="flex space-x-2 items-center">
            <div className="font-bold truncate">Sergei Orlov</div>
            <div className="shrink-0">
              <BsFillPatchCheckFill className="text-indigo-500 text-base" />
            </div>
          </div>
          <div className="w-full">
            <UsedSpace />
          </div>
        </div>
      </div>
    </div>
  )
}
