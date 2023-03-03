import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"

import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
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
import { PathBreadcrumbs } from "@ordo-pink/react-utils"
import { EditorState, EditorThemeClasses } from "lexical"
import { useState, useEffect, ComponentType, memo } from "react"
import { MdProps } from ".."
import { updatedFile } from "../../../containers/app/store"
import { useFileParentBreadcrumbs } from "../../../core/hooks/use-file-breadcrumbs"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

import { LoadEditorStatePlugin } from "../core-plugins/load-editor-state"

const theme: EditorThemeClasses = {
  heading: {
    h1: "font-extrabold text-5xl my-2",
    h2: "font-extrabold text-4xl my-2",
    h3: "font-extrabold text-3xl my-2",
    h4: "font-extrabold text-2xl my-2",
    h5: "font-extrabold text-xl my-2",
  },
  list: {
    ul: "list-inside list-disc my-2",
    ol: "list-inside list-decimal my-2",
  },
  link: "text-sky-700 visited:text-purple-700",
  paragraph: "my-2",
  hashtag: "text-pink-600 dark:text-pink-400",
  text: {
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
    bold: "font-bold",
    italic: "italic",
  },
  quote:
    "border-l border-b border-slate-400 dark:border-slate-600 p-4 max-w-xl my-2 text-sm rounded-bl-lg",
  code: "block px-6 py-4 bg-stone-200 dark:bg-stone-800 max-w-xl my-8 shadow-lg rounded-lg",
  codeHighlight: {
    atrule: "text-neutral-500",
    attr: "text-neutral-500",
    boolean: "text-orange-700",
    builtin: "text-emerald-600 font-bold",
    cdata: "text-neutral-400",
    char: "text-emerald-600",
    class: "text-emerald-900",
    "class-name": "text-emerald-900",
    comment: "text-neutral-400",
    constant: "text-orange-700",
    deleted: "text-orange-700",
    doctype: "text-neutral-400",
    entity: "text-stone-600",
    function: "text-emerald-900",
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
const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  HashtagNode,
]

export default memo(
  function MdEditor({ file }: MdProps) {
    const dispatch = useAppDispatch()
    const breadcrumbsPath = useFileParentBreadcrumbs()

    const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)

    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [plugins, setPlugins] = useState<ComponentType[]>([])

    // Prevent from updating the file at the moment it is opened
    useEffect(() => {
      setTimeout(() => setIsInitialLoad(false), 500)

      return () => {
        setIsInitialLoad(true)
      }
    }, [file.path])

    useEffect(() => {
      if (!pluginExtensions || !pluginExtensions.length) return

      setPlugins(
        pluginExtensions.reduce(
          (acc, extension) => acc.concat(extension.editorPlugins),
          [] as ComponentType[],
        ),
      )

      return () => setPlugins([])
    }, [pluginExtensions])

    const handleChange = (state: EditorState) => {
      if (isInitialLoad) return

      state.read(() => {
        const content = $convertToMarkdownString()

        dispatch(updatedFile({ path: file.path, content }))
      })
    }

    // eslint-disable-next-line no-console
    const onError = console.error

    return (
      <div className="p-4 w-full max-w-2xl">
        <LexicalComposer
          initialConfig={{
            namespace: "md-editor-root",
            onError,
            theme,
            nodes,
          }}
        >
          <div className="mb-8">
            <PathBreadcrumbs path={breadcrumbsPath} />

            <h1 className="text-3xl font-black">{file.readableName}</h1>
          </div>

          <div className="w-full h-screen flex flex-col items-center">
            <div className="w-full py-8 px-4">
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

              <LinkPlugin />
              <ListPlugin />
              <CheckListPlugin />

              <HashtagPlugin />
              <HistoryPlugin />
              <HorizontalRulePlugin />

              <CheckListPlugin />

              <RichTextPlugin
                contentEditable={<ContentEditable spellCheck={false} />}
                placeholder={<div>...</div>}
                ErrorBoundary={LexicalErrorBoundary}
              />

              <LoadEditorStatePlugin file={file} />
              <OnChangePlugin
                ignoreSelectionChange
                onChange={handleChange}
              />

              {plugins.map((Plugin, index) => (
                <Plugin key={index} />
              ))}
            </div>
          </div>
        </LexicalComposer>
      </div>
    )
  },
  (prev, next) => prev.file.path === next.file.path,
)
