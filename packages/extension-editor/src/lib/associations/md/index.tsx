import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { $convertToMarkdownString, TRANSFORMERS, Transformer } from "@lexical/markdown"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ExecuteCommandFn, FSDriver, IOrdoFile } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import {
  Null,
  useCommands,
  useFileContentText,
  useFsDriver,
  useSubscription,
} from "@ordo-pink/react-utils"
import { editorPlugins$ } from "@ordo-pink/stream-editor-plugins"
import { createDraft, finishDraft } from "immer"
import { EditorState, EditorThemeClasses, LexicalNode, ParagraphNode } from "lexical"
import { debounce } from "lodash"
import { mergeDeepWith } from "ramda"
import { ComponentType, memo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { LoadEditorStatePlugin } from "./load-state"
// import { TreeViewPlugin } from "./tree-view"
import DraggableBlockPlugin from "./plugins/draggable-block-plugin"

import "./index.css"

const debouncedSave = debounce(
  (
    driver: FSDriver,
    file: IOrdoFile,
    nodes: LexicalNode[],
    content: string,
    emit: ExecuteCommandFn,
  ) => {
    let metadata = {}

    const draft = createDraft(file)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes.forEach((child: any) => {
      if (child.ordoMetadata) {
        metadata = mergeDeepWith(
          (a, b) => (Array.isArray(a) ? a.concat(b) : b ? b : a),
          metadata,
          child.ordoMetadata,
        )
      }
    })

    draft.metadata = metadata

    const newFile = finishDraft(draft)

    emit("fs.update-file-content", { file: newFile, content })
  },
  1000,
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNodeArray = (tree: any) =>
  tree.children.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any[], child: any) =>
      child.children ? acc.concat(toNodeArray(child)) : acc.concat([child]),
    [],
  )

const theme: EditorThemeClasses = {
  heading: {
    h1: "m-4 ml-6 font-black text-3xl",
    h2: "m-4 ml-6 text-3xl",
    h3: "m-4 ml-6 font-black text-xl",
    h4: "m-4 ml-6 text-xl",
    h5: "m-4 ml-6 font-black text-lg",
  },
  list: {
    ul: "m-4 ml-6 list-inside list-disc",
    ol: "m-4 ml-6 list-inside list-decimal",
  },
  link: "text-sky-700 visited:text-purple-700",
  paragraph: "m-4 ml-6 my-2",
  hashtag: "text-pink-600 dark:text-pink-400",
  text: {
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
    bold: "font-bold",
    italic: "italic",
  },
  quote: "m-4 ml-6 p-4 text-sm rounded-lg shadow-lg bg-neutral-200 dark:bg-neutral-800 mr-4",
  code: "m-4 ml-6 block px-6 py-4 bg-neutral-100 dark:bg-neutral-800 my-8 shadow-lg rounded-lg mr-4",
  codeHighlight: {
    atrule: "text-neutral-500",
    attr: "text-neutral-500",
    boolean: "text-orange-700",
    builtin: "text-emerald-600 font-bold",
    cdata: "text-neutral-400",
    char: "text-emerald-600",
    class: "text-emerald-800",
    "class-name": "text-emerald-800",
    comment: "text-neutral-400",
    constant: "text-orange-700",
    deleted: "text-orange-700",
    doctype: "text-neutral-400",
    entity: "text-stone-600",
    function: "text-emerald-800",
    important: "text-neutral-600",
    inserted: "text-emerald-600",
    keyword: "text-neutral-500",
    namespace: "text-neutral-600",
    number: "text-orange-700",
    operator: "text-stone-600",
    prolog: "text-neutral-400",
    property: "text-orange-700",
    punctuation: "text-neutral-400",
    regex: "text-neutral-600",
    selector: "text-emerald-600",
    string: "text-emerald-600",
    symbol: "text-orange-700",
    tag: "text-orange-700",
    url: "text-stone-600",
    variable: "text-neutral-600",
  },
}

// TODO: Adding nodes
const initialNodes: (typeof LexicalNode)[] = [
  HeadingNode,
  ListNode as unknown as typeof LexicalNode,
  ListItemNode as unknown as typeof LexicalNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode as unknown as typeof LexicalNode,
  TableRowNode as unknown as typeof LexicalNode,
  AutoLinkNode,
  LinkNode,
  HashtagNode,
  ParagraphNode,
]

type Props = {
  file: IOrdoFile
}

const Placeholder = () => {
  const [editor] = useLexicalComposerContext()
  const { t } = useTranslation("editor")

  const tPlaceholder = t("placeholder")

  return (
    <div
      style={{ marginTop: "-1.5rem" }}
      className="text-neutral-500"
      onClick={() => editor && editor.focus()}
    >
      {tPlaceholder}
    </div>
  )
}

export default memo(
  function MdEditor({ file }: Props) {
    const editorPlugins = useSubscription(editorPlugins$)
    const driver = useFsDriver()
    const { emit } = useCommands()
    const content = useFileContentText(file)

    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)
    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false)

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
      if (_floatingAnchorElem !== null) {
        setFloatingAnchorElem(_floatingAnchorElem)
      }
    }

    useEffect(() => {
      const updateViewPortWidth = () => {
        const isNextSmallWidthViewport = window.matchMedia("(max-width: 1025px)").matches

        if (isNextSmallWidthViewport !== isSmallWidthViewport) {
          setIsSmallWidthViewport(isNextSmallWidthViewport)
        }
      }

      window.addEventListener("resize", updateViewPortWidth)

      return () => {
        window.removeEventListener("resize", updateViewPortWidth)
      }
    }, [isSmallWidthViewport])

    const handleChange = (state: EditorState) => {
      if (!driver || content === null) return

      state.read(() => {
        const text = $convertToMarkdownString(
          editorPlugins
            .reduce(
              (acc, plugin) => (plugin.transformer ? acc.concat([plugin.transformer]) : acc),
              [] as Transformer[],
            )
            .concat(TRANSFORMERS),
        )

        const nodes = toNodeArray(state.toJSON().root)

        if (content !== text) {
          debouncedSave(driver, file, nodes, text, emit)
        }
      })
    }

    // eslint-disable-next-line no-console
    const onError = console.error

    return Either.fromNullable(editorPlugins).fold(Null, (plugins) => (
      <div className="py-2 pl-2">
        <LexicalComposer
          initialConfig={{
            namespace: "md-editor-root",
            onError,
            theme,
            nodes: plugins
              .reduce(
                (acc, plugin) => (plugin.nodes ? acc.concat(plugin.nodes) : acc),
                [] as (typeof LexicalNode)[],
              )
              .concat(initialNodes),
          }}
        >
          {floatingAnchorElem && !isSmallWidthViewport ? (
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
          ) : (
            ""
          )}

          <MarkdownShortcutPlugin
            transformers={plugins
              .reduce(
                (acc, plugin) => (plugin.transformer ? acc.concat([plugin.transformer]) : acc),
                [] as Transformer[],
              )
              .concat(TRANSFORMERS)}
          />

          <LinkPlugin />
          <ListPlugin />
          <CheckListPlugin />

          <HashtagPlugin />
          <HistoryPlugin />
          <HorizontalRulePlugin />

          <CheckListPlugin />

          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div
                  className="editor"
                  ref={onRef}
                >
                  <ContentEditable
                    title="Editor"
                    spellCheck={false}
                  />
                </div>
              </div>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />

          <LoadEditorStatePlugin
            content={content}
            transformers={plugins
              .reduce(
                (acc, plugin) => (plugin.transformer ? acc.concat([plugin.transformer]) : acc),
                [] as Transformer[],
              )
              .concat(TRANSFORMERS)}
          />

          <OnChangePlugin
            ignoreSelectionChange
            onChange={handleChange}
          />

          <>
            {plugins
              .reduce(
                (acc, plugin) => (plugin.Plugin ? acc.concat([plugin.Plugin]) : acc),
                [] as ComponentType[],
              )
              .map((Plugin, index) => (
                <Plugin key={index} />
              ))}
          </>

          {/* <TreeViewPlugin /> */}
        </LexicalComposer>
      </div>
    ))
  },
  (prev, next) => prev.file.path === next.file.path,
)
