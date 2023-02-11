import Editor, { EditorPlugin } from "@draft-js-plugins/editor"
import { OrdoFile, OrdoFilePath } from "@ordo-pink/core"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import { selectFile } from "$activities/editor/store"
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
import { findOrdoFile } from "$core/utils/fs-helpers"

export default function MdEditor() {
  const dispatch = useAppDispatch()

  const tree = useAppSelector((state) => state.app.personalProject)

  const editorSelector = useExtensionSelector<EditorActivityState>()
  const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [plugins, setPlugins] = useState<EditorPlugin[]>([])

  const editorRef = useRef<Editor>(null)

  const [query] = useSearchParams()
  const { files } = useFSAPI()

  const path = query.get("path") as OrdoFilePath
  const breadcrumbsPath = useFileParentBreadcrumbs()

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
    if (!path || !files || !tree || !OrdoFile.isValidPath(path)) return

    files.get(path).then((payload) => {
      const file = findOrdoFile(path, tree)

      if (file) {
        dispatch(selectFile(file))
      }

      Box.of(payload)
        .map(markdownToDraft)
        .map(convertFromRaw)
        .map(EditorState.createWithContent)
        .fold(setEditorState)
    })
  }, [path, files, tree, dispatch])

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

            dispatch(updatedFile({ path: file.raw.path, content: markdownString }))
          }

          setEditorState(state)
        }}
      />
    </EditorPage>
  ))
}
