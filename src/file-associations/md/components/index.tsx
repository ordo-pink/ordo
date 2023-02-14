import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
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

import { EditorStatePlugin } from "../plugins/editor-state"
import { EditorActivityState } from "$activities/editor/types"

import { updatedFile } from "$containers/app/store"

import EditorPage from "$core/components/editor-page/editor-page"
import Null from "$core/components/null"
import { useFileParentBreadcrumbs } from "$core/hooks/use-file-breadcrumbs"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"

const theme: EditorThemeClasses = {}

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
    <EditorPage
      title={file.readableName}
      breadcrumbsPath={breadcrumbsPath}
    >
      <LexicalComposer
        initialConfig={{
          namespace: "md-editor-root",
          onError,
          theme,
          nodes,
        }}
      >
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <EditorStatePlugin />

        <OnChangePlugin
          ignoreSelectionChange
          onChange={handleChange}
        />

        <HistoryPlugin />

        <>
          {plugins.map((Plugin, index) => (
            <Plugin key={index} />
          ))}
        </>
      </LexicalComposer>
    </EditorPage>
  ))
}
