import React, { useLayoutEffect, useState, useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import SplitView from "react-split"

import {
  SPLIT_SNAP_OFFSET,
  SPLIT_MIN_SIZE,
  SPLIT_MIN_COLLAPSE_OFFSET,
  SPLIT_MAX_COLLAPSE_OFFSET,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
} from "@client/app/constants"
import { useAppDispatch, useAppSelector } from "@client/state"
import { selectActivity } from "@client/activity-bar/store"
import {
  getLocalSettings,
  getUserSettings,
  listDirectory,
  setSideBarWidth,
  toggleSideBar,
} from "@client/app/store"
import { showCommandPalette, addCommand } from "@client/command-palette/store"
import { Extensions } from "@extensions/index"
import Switch from "@core/utils/switch"
import i18next from "@client/i18n"

import ActivityBar from "@client/activity-bar"
import SideBar from "@client/side-bar"
import Workspace from "@client/workspace"
import CommandPalette from "@client/command-palette"
import Either from "@core/utils/either"
import CreateModal from "@client/create-modal"
import RenameModal from "@client/rename-modal"

export default function App() {
  const dispatch = useAppDispatch()
  const fontSize = useAppSelector((state) => state.app.userSettings["editor.font-size"])
  const language = useAppSelector((state) => state.app.userSettings["appearance.language"])
  const project = useAppSelector((state) => state.app.userSettings["project.personal.directory"])
  const isSideBarAvailable = useAppSelector((state) => state.app.isSideBarAvailable)
  const sideBarWidth = useAppSelector((state) => state.app.sideBarWidth)

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [isRightCollapsed, setIsRightCollapsed] = useState(false)
  const [sizes, setSizes] = useState<[number, number]>([sideBarWidth, 100 - sideBarWidth])

  useEffect(() => {
    Extensions.map(({ commands, translations }) => {
      Object.keys(translations).forEach((lng) => {
        i18next.addResourceBundle(lng, "translation", (translations as Record<string, string>)[lng])
      })

      commands.forEach((command) => {
        if (command.showInCommandPalette) dispatch(addCommand(command))
      })

      // TODO: Register accelerators
    })
  }, [])

  useHotkeys("ctrl+b", () => void dispatch(toggleSideBar()))
  useHotkeys("ctrl+e", () => void dispatch(selectActivity("editor")))
  useHotkeys("ctrl+,", () => void dispatch(selectActivity("settings")))
  useHotkeys("alt+n", () => void dispatch(selectActivity("notifications")))
  useHotkeys("ctrl+shift+p", () => void dispatch(showCommandPalette()))

  useLayoutEffect(() => {
    const body = document.querySelector(":root") as HTMLElement

    const size = Switch.of(fontSize)
      .case((size) => size < MIN_FONT_SIZE, MIN_FONT_SIZE)
      .case((size) => size > MAX_FONT_SIZE, MAX_FONT_SIZE)
      .default(fontSize)

    body.style.fontSize = `${size}px`
  }, [fontSize])

  useEffect(() => {
    setSizes([sideBarWidth, 100 - sideBarWidth])

    if (sideBarWidth < SPLIT_MIN_COLLAPSE_OFFSET) {
      setIsLeftCollapsed(true)
      setIsRightCollapsed(false)
    } else if (sideBarWidth > SPLIT_MAX_COLLAPSE_OFFSET) {
      setIsLeftCollapsed(false)
      setIsRightCollapsed(true)
    } else {
      setIsLeftCollapsed(false)
      setIsRightCollapsed(false)
    }
  }, [sideBarWidth])

  useEffect(() => void (project && dispatch(listDirectory(project))), [project])
  useEffect(() => void i18next.changeLanguage(language), [language])
  useEffect(
    () =>
      Either.fromBoolean(isSideBarAvailable)
        .map(() => [
          sideBarWidth < SPLIT_MIN_COLLAPSE_OFFSET,
          sideBarWidth > SPLIT_MAX_COLLAPSE_OFFSET,
        ])
        .fold(
          () => {
            setIsLeftCollapsed(true)
            setIsRightCollapsed(false)
          },
          ([left, right]) => {
            setIsLeftCollapsed(left)
            setIsRightCollapsed(right)
          }
        ),
    [isSideBarAvailable]
  )

  useEffect(() => {
    dispatch(getUserSettings())
    dispatch(getLocalSettings())
  }, [])

  const handleDragEnd = (sectionSizes: [number, number]) => {
    setSizes(sectionSizes)
    dispatch(setSideBarWidth(sectionSizes[0]))
  }

  const handleDrag = (sectionSizes: [number, number]) => {
    const [leftSize, rightSize] = sectionSizes

    const isSideBarCollapsed = leftSize < SPLIT_MIN_COLLAPSE_OFFSET
    const isWorkspaceCollapsed = rightSize < SPLIT_MIN_COLLAPSE_OFFSET

    setIsLeftCollapsed(isSideBarCollapsed)
    setIsRightCollapsed(isWorkspaceCollapsed)
  }

  return (
    <div className="flex flex-col min-h-screen text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 app">
      <div className="flex grow">
        <ActivityBar />
        {isSideBarAvailable ? (
          <SplitView
            className="fixed top-0 left-10 right-0 bottom-0 flex grow"
            sizes={sizes}
            snapOffset={SPLIT_SNAP_OFFSET}
            minSize={SPLIT_MIN_SIZE}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`overflow-y-scroll h-full bg-neutral-200 dark:bg-neutral-900 ${
                isLeftCollapsed && "hidden"
              }`}
            >
              <SideBar />
            </div>
            <div className={`overflow-y-scroll h-full ${isRightCollapsed && "hidden"}`}>
              <Workspace />
            </div>
          </SplitView>
        ) : (
          <div className="fixed top-0 left-10 right-0 bottom-0 flex grow">
            <div className="h-full w-4 bg-neutral-200 dark:bg-neutral-900"></div>
            <div className="overflow-y-scroll h-full">
              <Workspace />
            </div>
          </div>
        )}
      </div>
      <CommandPalette />
      <CreateModal />
      <RenameModal />
    </div>
  )
}
