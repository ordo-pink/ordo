import React, { useLayoutEffect, useState, useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import SplitView from "react-split"

import { SPLIT_SNAP_OFFSET, SPLIT_MIN_SIZE } from "@client/app/constants"
import { useAppDispatch, useAppSelector } from "@client/state"
import { selectActivity } from "@client/activity-bar/store"
import {
  getLocalSettings,
  getUserSettings,
  listFolder,
  setSideBarWidth,
  toggleSideBar,
} from "@client/app/store"
import i18n from "@client/i18n"

import ActivityBar from "@client/activity-bar"
import SideBar from "@client/side-bar"
import Workspace from "@client/workspace"
import Switch from "@core/utils/switch"

export default function App() {
  const dispatch = useAppDispatch()
  const fontSize = useAppSelector((state) => state.app.userSettings?.["editor.font-size"]) ?? 16
  const language =
    useAppSelector((state) => state.app.userSettings?.["appearance.language"]) ?? "en"
  const project = useAppSelector((state) => state.app.userSettings?.["project.personal.directory"])
  const sideBarWidth = useAppSelector((state) => state.app.sideBarWidth)
  const isSideBarAvailable = useAppSelector((state) => state.app.isSideBarAvailable)

  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false)
  const [isRightCollapsed, setIsRightCollapsed] = useState(false)
  const [sizes, setSizes] = useState<[number, number]>([sideBarWidth, 100 - sideBarWidth])

  useHotkeys("ctrl+b", () => void dispatch(toggleSideBar()))
  useHotkeys("ctrl+e", () => void dispatch(selectActivity("editor")))
  useHotkeys("ctrl+,", () => void dispatch(selectActivity("settings")))
  useHotkeys("alt+n", () => void dispatch(selectActivity("notifications")))

  useLayoutEffect(() => {
    const body = document.querySelector(":root") as HTMLElement
    const size = Switch.of(fontSize)
      .case((size) => size < 8, 8)
      .case((size) => size > 25, 25)
      .default(fontSize)

    body.style.fontSize = `${size}px`
  }, [fontSize])

  useEffect(() => {
    setSizes([sideBarWidth, 100 - sideBarWidth])
    if (sideBarWidth < 2) {
      setIsLeftCollapsed(true)
      setIsRightCollapsed(false)
    } else if (sideBarWidth > 98) {
      setIsLeftCollapsed(false)
      setIsRightCollapsed(true)
    } else {
      setIsLeftCollapsed(false)
      setIsRightCollapsed(false)
    }
  }, [sideBarWidth])

  useEffect(() => void (project && dispatch(listFolder(project))), [project])
  useEffect(() => void i18n.changeLanguage(language), [language])
  useEffect(() => {
    if (!isSideBarAvailable) {
      setIsLeftCollapsed(true)
      setIsRightCollapsed(false)
      return
    }

    const isSideBarCollapsed = sideBarWidth < 2
    const isWorkspaceCollapsed = sideBarWidth > 98

    setIsLeftCollapsed(isSideBarCollapsed)
    setIsRightCollapsed(isWorkspaceCollapsed)
  }, [isSideBarAvailable])

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

    const isSideBarCollapsed = leftSize < 2
    const isWorkspaceCollapsed = rightSize < 2

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
            <div className="h-full w-[10.5px] bg-neutral-200 dark:bg-neutral-900"></div>
            <div className={`overflow-y-scroll h-full ${isRightCollapsed && "hidden"}`}>
              <Workspace />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
