import { CodeNode, CodeHighlightNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListNode, ListItemNode } from "@lexical/list"
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table"
import { EditorThemeClasses } from "lexical"
import { useState, useEffect, ComponentType } from "react"
import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"
import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

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

export default function Home() {
  const Workspace = useWorkspace()

  const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)

  const [plugins, setPlugins] = useState<ComponentType[]>([])

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

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-home/title")
  const translatedText = t("@ordo-activity-home/text")

  // eslint-disable-next-line no-console
  const onError = console.error

  return (
    <Workspace>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <div className="w-full h-screen flex flex-col items-center">
        <div className="prose prose-pink dark:prose-invert w-full py-8 px-4">
          <LexicalComposer
            initialConfig={{
              namespace: "md-editor-root",
              onError,
              theme,
              nodes,
              editorState: (editor) => {
                editor.update(() => {
                  $convertFromMarkdownString(translatedText)
                })
              },
            }}
          >
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={<div>...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />

            <>
              {plugins.map((Plugin, index) => (
                <Plugin key={index} />
              ))}
            </>
          </LexicalComposer>
        </div>
      </div>
    </Workspace>
  )
}
