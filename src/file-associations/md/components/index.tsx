import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { HashtagNode } from "@lexical/hashtag"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { OrdoFilePath } from "@ordo-pink/core"
import { EditorState, EditorThemeClasses } from "lexical"
import { useState, useEffect, ComponentType } from "react"
import { useSearchParams } from "react-router-dom"

import { LoadEditorStatePlugin } from "../core-plugins/load-editor-state"
import { EditorActivityState } from "$activities/editor/types"

import { updatedFile } from "$containers/app/store"

import Null from "$core/components/null"
import PathBreadcrumbs from "$core/components/path-breadcrumbs"
import { useFileParentBreadcrumbs } from "$core/hooks/use-file-breadcrumbs"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"

const theme: EditorThemeClasses = {
  heading: {
    h1: "text-5xl mb-8",
    h2: "text-4xl mb-7",
    h3: "text-3xl mb-6",
    h4: "text-2xl mb-5",
    h5: "text-xl mb-4",
  },
  list: {
    ul: "list-inside list-disc mb-4",
    ol: "list-inside list-decimal mb-4",
  },
  paragraph: "mb-4",
  hashtag: "text-pink-600 dark:text-pink-300",
  text: {
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
    bold: "font-bold",
    italic: "italic",
  },
}

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

export default function MdEditor() {
  const dispatch = useAppDispatch()

  const editorSelector = useExtensionSelector<EditorActivityState>()
  const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)
  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [query] = useSearchParams()

  const breadcrumbsPath = useFileParentBreadcrumbs()

  const [path, setPath] = useState<OrdoFilePath>("" as OrdoFilePath)
  const [plugins, setPlugins] = useState<ComponentType[]>([])

  useEffect(() => {
    setPath(query.get("path") as OrdoFilePath)

    return () => {
      setIsInitialLoad(true)
    }
  }, [query])

  useEffect(() => {
    if (!pluginExtensions || !pluginExtensions.length) return

    setPlugins(
      pluginExtensions.reduce(
        (acc, extension) => acc.concat(extension.plugins),
        [] as ComponentType[],
      ),
    )

    return () => setPlugins([])
  }, [pluginExtensions])

  const handleChange = (state: EditorState) => {
    state.read(() => {
      const content = $convertToMarkdownString()

      if (!isInitialLoad) {
        dispatch(updatedFile({ path, content }))
      }

      setIsInitialLoad(false)
    })
  }

  // eslint-disable-next-line no-console
  const onError = console.error

  return Either.fromNullable(currentFile).fold(Null, (file) => (
    <div className="p-4 w-full">
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
          <div className="prose prose-pink dark:prose-invert w-full py-8 px-4">
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

            <HashtagPlugin />
            <HistoryPlugin />

            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={<div>...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />

            <LoadEditorStatePlugin />

            <OnChangePlugin
              ignoreSelectionChange
              onChange={handleChange}
            />

            <>
              {plugins.map((Plugin, index) => (
                <Plugin key={index} />
              ))}
            </>
          </div>
        </div>
      </LexicalComposer>
    </div>
  ))
}
