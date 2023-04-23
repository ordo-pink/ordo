import { Nullable, UnaryFn } from "@ordo-pink/common-types"
import { Link, useCommandPalette, useFsDriver, useSubscription } from "@ordo-pink/react-utils"
import { commandPaletteItems$ } from "@ordo-pink/stream-command-palette"
import { MouseEvent, PropsWithChildren, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { BsThreeDotsVertical } from "react-icons/bs"
import UsedSpace from "./used-space"
import logo from "../assets/logo.png"

import "./sidebar.css"

type Props = PropsWithChildren<{
  onClick: UnaryFn<MouseEvent, void>
}>

/**
 * The sidebar component. It is only shown if the `Sidebar` property is
 * specified for the current activity. Sidebar always includes the Ordo.pink
 * logo and the CommandPalette button at the top, and User info at the bottom.
 *
 * If the activity does not specify the Sidebar, the CommandPalette button
 * moves to the top of the ActivityBar, and the User avatar moves to the bottom
 * of the ActivityBar.
 */
export default function Sidebar({ children, onClick }: Props) {
  const { showCommandPalette } = useCommandPalette()
  const commandPaletteItems = useSubscription(commandPaletteItems$)
  const driver = useFsDriver()

  const [userInfo, setUserInfo] = useState<Nullable<{ firstName: string; lastName: string }>>(null)
  const [userAvatar, setUserAvatar] = useState<Nullable<string>>(null)

  useEffect(() => {
    if (!driver) return

    driver.files.getContent("/.avatar.png").then((res) => {
      if (!res.ok) return

      res.blob().then((blob) => {
        setUserAvatar(URL.createObjectURL(blob))
      })
    })

    driver.files.getContent("/user.metadata").then((res) => {
      if (!res.ok) return

      res.json().then(setUserInfo)
    })
  }, [driver])

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
      className="flex flex-col p-4 h-full bg-neutral-200 dark:bg-neutral-800"
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
          <BsThreeDotsVertical />
        </div>
      </div>
      <div className="flex-grow">{children}</div>
      <div className="flex items-center space-x-4 w-full max-w-sm self-center justify-center">
        <div className="rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
          <div className="bg-white rounded-full">
            <Link href="/user">
              <img
                src={userAvatar ?? logo}
                alt="User avatar"
                className="w-10 rounded-full"
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col text-sm text-neutral-700 dark:text-neutral-400 w-full -mt-1">
          <div className="flex space-x-2 items-center">
            <div className="font-bold truncate">
              <Link
                href="/user"
                className="no-underline text-neutral-700 dark:text-neutral-400"
              >
                {userInfo?.firstName} {userInfo?.lastName}
              </Link>
            </div>
            {/* <div className="shrink-0">
              <BsFillPatchCheckFill className="text-indigo-500 text-base" />
            </div> */}
          </div>
          <div className="w-full">
            <UsedSpace />
          </div>
        </div>
      </div>
    </div>
  )
}
