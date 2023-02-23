import { $isCodeNode, getDefaultCodeLanguage, getCodeLanguages } from "@lexical/code"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { $isListNode, ListNode } from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isHeadingNode } from "@lexical/rich-text"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Null } from "@ordo-pink/react"
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  $getNodeByKey,
  FORMAT_TEXT_COMMAND,
} from "lexical"
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  ChangeEvent,
  ChangeEventHandler,
  useRef,
} from "react"
import { createPortal } from "react-dom"
import {
  AiOutlineBold,
  AiOutlineCode,
  AiOutlineItalic,
  AiOutlineLink,
  AiOutlineStrikethrough,
  AiOutlineUnderline,
} from "react-icons/ai"
import { BlockOptions } from "./block-options"
import { LinkEditor } from "./link-editor"
import { LOW_PRIORITY } from "../constants"
import { getSelectedNode } from "../utils/get-selected-node"
import { positionEditorElement } from "../utils/position-editor-element"

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "ul",
  "ol",
])

function Select({
  onChange,
  className,
  options,
  value,
}: {
  onChange: ChangeEventHandler
  className: string
  options: string[]
  value: string
}) {
  return (
    <select
      className={className}
      onChange={onChange}
      value={value}
    >
      <option
        hidden={true}
        value=""
      />
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  )
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [blockType, setBlockType] = useState("paragraph")
  const [selectedElementKey, setSelectedElementKey] = useState<Nullable<string>>(null)
  const [codeLanguage, setCodeLanguage] = useState("")
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isRangeSelection, setIsRangeSelection] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      setIsRangeSelection(
        selection.anchor.getNode() !== selection.focus.getNode() ||
          selection.anchor.offset !== selection.focus.offset,
      )

      const anchorNode = selection.anchor.getNode()

      const element =
        anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)

        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList ? parentList.getTag() : element.getTag()

          setBlockType(type)
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()

          setBlockType(type)

          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage())
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))
      setIsStrikethrough(selection.hasFormat("strikethrough"))
      setIsCode(selection.hasFormat("code"))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    } else {
      setIsRangeSelection(false)
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar()
          return false
        },
        LOW_PRIORITY,
      ),
    )
  }, [editor, updateToolbar])

  const codeLanguages = useMemo(() => getCodeLanguages(), [])

  const onCodeLanguageSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey)

          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value)
          }
        }
      })
    },
    [editor, selectedElementKey],
  )

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://")
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()

    const toolbarElem = toolbarRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement

    if (toolbarElem === null) {
      return
    }

    const rootElement = editor.getRootElement()
    if (
      selection !== null &&
      nativeSelection &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0)
      let rect
      if (nativeSelection.anchorNode === rootElement) {
        let inner: Element = rootElement
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild
        }
        rect = inner.getBoundingClientRect()
      } else {
        rect = domRange.getBoundingClientRect()
      }

      positionEditorElement(toolbarElem, rect)
    } else if (!activeElement) {
      positionEditorElement(toolbarElem, null)
    }

    return true
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
        LOW_PRIORITY,
      ),
    )
  }, [editor, updateLinkEditor])

  return Either.fromBoolean(isRangeSelection).fold(Null, () =>
    createPortal(
      <div
        ref={toolbarRef}
        className="absolute z-[1000] flex flex-col space-y-2 items-center bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-lg p-2 rounded-sm"
      >
        <div>
          {supportedBlockTypes.has(blockType) && (
            <BlockOptions
              editor={editor}
              blockType={blockType}
            />
          )}
        </div>

        {blockType === "code" ? (
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={codeLanguages}
            value={codeLanguage}
          />
        ) : isLink ? (
          <LinkEditor editor={editor} />
        ) : (
          <div className="flex space-x-2 items-center">
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
              }}
              className={"toolbar-item spaced " + (isBold ? "active" : "")}
              aria-label="Format Bold"
            >
              <AiOutlineBold />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
              }}
              className={"toolbar-item spaced " + (isItalic ? "active" : "")}
              aria-label="Format Italics"
            >
              <AiOutlineItalic />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
              }}
              className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
              aria-label="Format Underline"
            >
              <AiOutlineUnderline />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
              }}
              className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
              aria-label="Format Strikethrough"
            >
              <AiOutlineStrikethrough />
            </button>
            <button
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")
              }}
              className={"toolbar-item spaced " + (isCode ? "active" : "")}
              aria-label="Insert Code"
            >
              <AiOutlineCode />
            </button>
            <button
              onClick={insertLink}
              className={"toolbar-item spaced " + (isLink ? "active" : "")}
              aria-label="Insert Link"
            >
              <AiOutlineLink />
            </button>
          </div>
        )}
      </div>,
      document.body,
    ),
  )
}
