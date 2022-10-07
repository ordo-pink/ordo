import type { Nullable } from "@core/types"

import React, { useEffect, useState, MouseEvent } from "react"

import { useAppDispatch, useAppSelector } from "@client/state"
import { getFileParser } from "@core/get-file-parser"
import Either from "@core/utils/either"

import Null from "@client/null"

import "@client/editor/index.css"
import { CaretRangeDirection } from "../../core/editor/constants"
import { useHotkeys } from "react-hotkeys-hook"
import { noOp } from "@core/utils/no-op"
import { preventDefault } from "@core/utils/event"
import Line from "./components/line"
import Switch from "@core/utils/switch"
import { initialCaretRanges } from "@core/editor/initial-caret-ranges"
import {
  handleArrowDown,
  handleArrowUp,
  handleArrowLeft,
  handleArrowRight,
} from "@core/editor/key-handlers/arrows"
import { handleBackspace } from "@core/editor/key-handlers/backspace"
import { handleChar } from "@core/editor/key-handlers/char"
import { handleDelete } from "@core/editor/key-handlers/delete"
import { handleEnter } from "@core/editor/key-handlers/enter"
import { RootNode } from "@core/editor/types"
import { IsKey } from "@core/editor/is-key"
import { enableSideBar, saveFile } from "@client/app/store"
import { useIcon } from "@client/use-icon"
import { useRenameModal } from "@client/app/hooks/use-rename-modal"

export default function Editor() {
  const dispatch = useAppDispatch()

  const [raw, setRaw] = useState("")
  const [parsedFile, setParsedFile] = useState<Nullable<RootNode>>(null)
  const [parse, setParse] = useState<(raw: string) => Nullable<RootNode>>(() => null)
  const [caretRanges, setCaretRanges] = useState(initialCaretRanges)

  const currentFileRaw = useAppSelector((state) => state.app.currentFileRaw)
  const currentFile = useAppSelector((state) => state.app.currentFile)
  const isSavingFile = useAppSelector((state) => state.app.isLoading)

  const SpinIcon = useIcon("HiOutlineRefresh")

  useEffect(() => void dispatch(enableSideBar()), [])

  useEffect(() => {
    if (currentFile) setParse(() => getFileParser(currentFile))
  }, [currentFile?.extension])

  useEffect(() => {
    if (parse) setParsedFile(parse(raw))
  }, [raw, parse])

  useEffect(() => {
    if (currentFileRaw != null) setRaw(currentFileRaw)
    setCaretRanges(initialCaretRanges)
  }, [currentFileRaw, currentFile?.path])

  const { showRenameModal, RenameModal } = useRenameModal(currentFile)

  useHotkeys("f2", () => showRenameModal(), [currentFile])

  const onArrowDown = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleArrowDown(caretRanges))
      .fold(noOp, setCaretRanges)

  const onArrowUp = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleArrowUp(caretRanges))
      .fold(noOp, setCaretRanges)

  const onArrowLeft = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleArrowLeft(caretRanges))
      .fold(noOp, setCaretRanges)

  const onArrowRight = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleArrowRight(caretRanges))
      .fold(noOp, setCaretRanges)

  const onEnter = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleEnter(caretRanges))
      .fold(noOp, ({ ranges, raw }) => {
        setRaw(raw)
        setCaretRanges(ranges)
        if (!parsedFile || !currentFile) return

        dispatch(
          saveFile({
            checkboxes: parsedFile.data.checkboxes,
            dates: parsedFile.data.dates,
            links: parsedFile.data.links,
            tags: parsedFile.data.tags,
            path: currentFile.path,
            raw,
          })
        )
      })

  const onBackspace = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleBackspace(caretRanges))
      .fold(noOp, ({ ranges, raw }) => {
        setRaw(raw)
        setCaretRanges(ranges)
        if (!parsedFile || !currentFile) return

        dispatch(
          saveFile({
            checkboxes: parsedFile.data.checkboxes,
            dates: parsedFile.data.dates,
            links: parsedFile.data.links,
            tags: parsedFile.data.tags,
            path: currentFile.path,
            raw,
          })
        )
      })

  const onDelete = (event: Event) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .map(handleDelete(caretRanges))
      .fold(noOp, ({ ranges, raw }) => {
        setRaw(raw)
        setCaretRanges(ranges)
        if (!parsedFile || !currentFile) return

        dispatch(
          saveFile({
            checkboxes: parsedFile.data.checkboxes,
            dates: parsedFile.data.dates,
            links: parsedFile.data.links,
            tags: parsedFile.data.tags,
            path: currentFile.path,
            raw,
          })
        )
      })

  const onChar = (event: KeyboardEvent) =>
    Either.of(event)
      .map(preventDefault)
      .chain(() => Either.fromNullable(parsedFile))
      .chain((file) =>
        Either.fromBoolean(event.key.length === 1)
          .map(() => (event.shiftKey ? event.key.toLocaleUpperCase() : event.key))
          .map((char) => handleChar(caretRanges, char))
          .map((handleFile) => handleFile(file))
      )
      .fold(noOp, ({ ranges, raw }) => {
        setRaw(raw)
        setCaretRanges(ranges)
        if (!parsedFile || !currentFile) return

        dispatch(
          saveFile({
            checkboxes: parsedFile.data.checkboxes,
            dates: parsedFile.data.dates,
            links: parsedFile.data.links,
            tags: parsedFile.data.tags,
            path: currentFile.path,
            raw,
          })
        )
      })

  // TODO: 100
  // TODO: 101
  // TODO: 102
  // TODO: 103
  // TODO: 104
  // TODO: 105
  // TODO: 106
  // BUG: 107
  useHotkeys(
    "*",
    (event) => {
      const handle = Switch.of(event)
        .case(IsKey.backspace, onBackspace)
        .case(IsKey.delete, onDelete)
        .case(IsKey.enter, onEnter)
        .case(IsKey.arrowLeft, onArrowLeft)
        .case(IsKey.arrowRight, onArrowRight)
        .case(IsKey.arrowUp, onArrowUp)
        .case(IsKey.arrowDown, onArrowDown)
        .case(IsKey.char, onChar)
        .default(noOp)

      handle(event)
    },
    [parsedFile, caretRanges, currentFile]
  )

  const handleClick = (event: MouseEvent) => {
    if (!parsedFile) return

    event.preventDefault()
    event.stopPropagation()

    const lastLineIndex = parsedFile.children.length - 1
    const column = parsedFile.children[lastLineIndex].position.end.column - 1
    const line = lastLineIndex + 1

    setCaretRanges([
      {
        start: { line, column },
        end: { line, column },
        direction: CaretRangeDirection.LEFT_TO_RIGHT,
      },
    ])
  }

  const LinkIcon = useIcon("BsLink")
  const TagIcon = useIcon("BsTag")
  // TODO: Add icon for when none of the checkboxes are checked
  const CheckboxIcon = useIcon("BsCheckCircle")
  const DateIcon = useIcon("BsCalendar2Check")
  const DateMissedIcon = useIcon("BsCalendar2Event")

  return Either.fromNullable(parsedFile).fold(Null, (file) => (
    <div className="h-full">
      <div className="pb-4 flex flex-col space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="flex space-x-8 items-center">
          {currentFile?.metadata.checkboxes.length ? (
            <div
              className={`flex items-center space-x-2 ${
                currentFile?.metadata.checkboxes.filter((checkbox) => checkbox.checked).length ===
                currentFile.metadata.checkboxes.length
                  ? "font-bold text-emerald-700 dark:text-emerald-500"
                  : ""
              }`}
            >
              <CheckboxIcon />
              {/* TODO: Extract all these */}
              <div>
                {currentFile?.metadata.checkboxes.filter((checkbox) => checkbox.checked).length}/
                {currentFile.metadata.checkboxes.length}
              </div>
            </div>
          ) : null}

          {currentFile?.metadata.links.length ? (
            <div className="flex items-center space-x-2">
              <LinkIcon />
              <div>{currentFile?.metadata.links.length}</div>
            </div>
          ) : null}

          {currentFile?.metadata.dates.length ? (
            <div className="flex space-x-4">
              {currentFile.metadata.dates.map((date, index) => (
                <div className="flex space-x-2 items-center" key={index}>
                  {date.remind && date.start < new Date() ? (
                    <DateMissedIcon className="text-orange-700" />
                  ) : (
                    <DateIcon />
                  )}
                  <time>{date.start.toLocaleDateString()}</time>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {currentFile?.metadata.tags.length ? (
          <div className="flex items-center space-x-2">
            <TagIcon />
            <div className="flex space-x-2 flex-wrap">
              {currentFile?.metadata.tags.map((tag) => (
                <div className="drop-shadow-lg" key={tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="cursor-text h-full" onClick={handleClick}>
        {file.children.map((node) => (
          <Line
            key={`${node.position?.start.line}-${node.position?.start.column}-${node.position?.end.line}-${node.position?.end.column}`}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            node={node}
          />
        ))}
        {isSavingFile && (
          <div className="fixed top-5 right-5">
            <SpinIcon className="text-sm text-neutral-500 animate-spin duration-300" />
          </div>
        )}
      </div>
      <RenameModal />
    </div>
  ))
}
