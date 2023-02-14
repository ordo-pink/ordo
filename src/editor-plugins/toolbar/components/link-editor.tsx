import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { mergeRegister } from "@lexical/utils"
import { $getSelection, $isRangeSelection, LexicalEditor, SELECTION_CHANGE_COMMAND } from "lexical"
import { useRef, useState, useCallback, useEffect } from "react"
import { BsCheck2, BsPencilSquare } from "react-icons/bs"
import { Link } from "react-router-dom"
import { LowPriority } from "../constants"
import { getSelectedNode } from "../utils/get-selected-node"
import { OrdoButtonSecondary } from "$core/components/buttons"

type Props = {
  editor: LexicalEditor
}

export function LinkEditor({ editor }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [isEditMode, setEditMode] = useState(false)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const parent = node.getParent()

      if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else {
        setLinkUrl("")
      }
    }

    const activeElement = document.activeElement

    if (!activeElement) {
      setEditMode(false)
      setLinkUrl("")
    }

    return true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  useEffect(() => {
    mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        LowPriority,
      ),
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditMode])

  return (
    <div className="w-full">
      {isEditMode ? (
        <div className="flex items-center justify-between">
          <input
            ref={inputRef}
            className="h-full"
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()

                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
                }
                setEditMode(false)
              } else if (event.key === "Escape") {
                event.preventDefault()
                setEditMode(false)
              }
            }}
          />
          <OrdoButtonSecondary
            className=""
            onClick={() => setEditMode(false)}
          >
            <BsCheck2 className="text-xs" />
          </OrdoButtonSecondary>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            {linkUrl.startsWith("http") ? (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkUrl}
              </a>
            ) : (
              <Link to={linkUrl}>{linkUrl}</Link>
            )}
          </div>
          <OrdoButtonSecondary
            className="link-edit"
            onClick={() => setEditMode(true)}
          >
            <BsPencilSquare className="text-xs" />
          </OrdoButtonSecondary>
        </div>
      )}
    </div>
  )
}
