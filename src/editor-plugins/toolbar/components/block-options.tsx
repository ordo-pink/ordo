import { $createCodeNode } from "@lexical/code"
import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { $wrapNodes } from "@lexical/selection"
import { $getSelection, $isRangeSelection, $createParagraphNode, LexicalEditor } from "lexical"
import { BsBlockquoteLeft, BsCode, BsListOl, BsListUl, BsTextParagraph } from "react-icons/bs"

type Props = {
  editor: LexicalEditor
  blockType: string
}

export function BlockOptions({ editor, blockType }: Props) {
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode())
        }
      })
    }
  }

  const formatH1 = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"))
        }
      })
    }
  }

  const formatH2 = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"))
        }
      })
    }
  }

  const formatH3 = () => {
    if (blockType !== "h3") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h3"))
        }
      })
    }
  }

  const formatH4 = () => {
    if (blockType !== "h4") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h4"))
        }
      })
    }
  }

  const formatH5 = () => {
    if (blockType !== "h5") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h5"))
        }
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, void 0)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0)
    }
  }

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, void 0)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0)
    }
  }

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode())
        }
      })
    }
  }

  return (
    <div className="flex space-x-2 items-center">
      <button onClick={formatParagraph}>
        <BsTextParagraph />
      </button>

      <button onClick={formatH1}>{"H1"}</button>
      <button onClick={formatH2}>{"H2"}</button>
      <button onClick={formatH3}>{"H3"}</button>
      <button onClick={formatH4}>{"H4"}</button>
      <button onClick={formatH5}>{"H5"}</button>

      <button onClick={formatBulletList}>
        <BsListUl />
      </button>

      <button onClick={formatNumberedList}>
        <BsListOl />
      </button>

      <button onClick={formatQuote}>
        <BsBlockquoteLeft />
      </button>

      <button onClick={formatCode}>
        <BsCode />
      </button>
    </div>
  )
}
