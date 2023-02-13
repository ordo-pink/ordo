import Editor, { EditorPlugin } from "@draft-js-plugins/editor"
import { OrdoFilePath } from "@ordo-pink/core"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import { EditorActivityState } from "$activities/editor/types"

import { updatedFile } from "$containers/app/store"

import EditorPage from "$core/components/editor-page/editor-page"
import Null from "$core/components/null"
import { useFileParentBreadcrumbs } from "$core/hooks/use-file-breadcrumbs"
import { useFSAPI } from "$core/hooks/use-fs-api"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Box } from "$core/utils/box"
import { Either } from "$core/utils/either"

export default function MdEditor() {
  const dispatch = useAppDispatch()

  const editorSelector = useExtensionSelector<EditorActivityState>()
  const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)
  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const breadcrumbsPath = useFileParentBreadcrumbs()

  const [path, setPath] = useState<OrdoFilePath>("" as OrdoFilePath)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [plugins, setPlugins] = useState<EditorPlugin[]>([])

  const editorRef = useRef<Editor>(null)

  const [query] = useSearchParams()
  const { files } = useFSAPI()

  useEffect(() => {
    setPath(query.get("path") as OrdoFilePath)
  }, [query])

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

      return () => setPlugins([])
    }
  }, [pluginExtensions, editorState])

  useEffect(() => {
    if (!path) return

    files.get(path).then((payload) => {
      Box.of(payload)
        .map(markdownToDraft)
        .map(convertFromRaw)
        .map(EditorState.createWithContent)
        .fold(setEditorState)
    })
  }, [path, files])

  const handleEditorClick = () => editorRef.current?.focus()

  return Either.fromNullable(currentFile).fold(Null, (file) => (
    <EditorPage
      title={file.readableName}
      breadcrumbsPath={breadcrumbsPath}
      onClick={handleEditorClick}
    >
      <Editor
        // placeholder="Type something..."
        ref={editorRef}
        editorState={editorState}
        plugins={plugins}
        onChange={(state) => {
          if (state.getLastChangeType() != null) {
            const content = state.getCurrentContent()
            const raw = convertToRaw(content)
            const markdownString = draftToMarkdown(raw)

            if (!markdownString) return

            dispatch(updatedFile({ path: file.path, content: markdownString }))
          }

          setEditorState(state)
        }}
      />
    </EditorPage>
  ))
}
