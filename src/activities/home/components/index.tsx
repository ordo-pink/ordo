import Editor, { EditorPlugin } from "@draft-js-plugins/editor"
import { EditorState, convertFromRaw } from "draft-js"
import { markdownToDraft } from "markdown-draft-js"
import { useState, useRef, useEffect } from "react"
import Helmet from "react-helmet"
import { useTranslation } from "react-i18next"

import { useWorkspace } from "$containers/workspace/hooks/use-workspace"

import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { lazyBox } from "$core/utils/lazy-box"

export default function ExtensionStore() {
  const Workspace = useWorkspace()

  const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [plugins, setPlugins] = useState<EditorPlugin[]>([])

  const editorRef = useRef<Editor>(null)

  const { t } = useTranslation()

  const translatedTitle = t("@ordo-activity-home/title")
  const translatedText = t("@ordo-activity-home/text")

  useEffect(() => {
    if (pluginExtensions) {
      let plugins = [] as EditorPlugin[]

      pluginExtensions.forEach((extension) => {
        plugins = plugins.concat(
          extension.plugins.map((plugin) => {
            if (!plugin) return plugin

            plugin.initialize &&
              plugin.initialize({
                getEditorState: () => editorState,
                setEditorState: (editorState) => setEditorState(editorState),
                setReadOnly: () => void 0,
                getReadOnly: () => false,
                getEditorRef: () => ({
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  editor: editorRef.current as any,
                  refs: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    editor: editorRef.current as any,
                  },
                }),
                getPlugins: () => plugins,
                getProps: () => void 0,
              })

            return plugin
          }),
        )
      })

      setPlugins(plugins)
    }

    return () => setPlugins([])
  }, [pluginExtensions, editorState])

  useEffect(() => {
    const raw = markdownToDraft(translatedText)

    console.log(raw)
    const contentState = convertFromRaw(raw)

    setEditorState(EditorState.createWithContent(contentState))
  }, [translatedText])

  const handleEditorClick = lazyBox((box) => box.fold(() => editorRef.current?.focus()))

  return (
    <Workspace>
      <Helmet>
        <title>
          {"Ordo.pink | "}
          {translatedTitle}
        </title>
      </Helmet>

      <div
        className="w-full h-screen flex flex-col items-center"
        role="none"
        onClick={handleEditorClick}
      >
        <div className="prose prose-pink dark:prose-invert w-full py-8 px-4">
          <Editor
            ref={editorRef}
            editorState={editorState}
            plugins={plugins}
            onChange={(state) => {
              setEditorState(state)
            }}
            handlePastedText={(_, __, state) => {
              setEditorState(state)

              return "not-handled"
            }}
          />
        </div>
      </div>
    </Workspace>
  )
}
