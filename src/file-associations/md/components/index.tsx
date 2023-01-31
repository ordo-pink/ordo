import Editor, { EditorPlugin } from "@draft-js-plugins/editor"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import EditorPage from "$activities/editor/components/editor-page"
import { selectFile } from "$activities/editor/store"
import { EditorExtensionStore } from "$activities/editor/types"

import Null from "$core/components/null"
import { useFSAPI } from "$core/hooks/use-fs-api"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { Either } from "$core/utils/either"
import { getParentPath } from "$core/utils/fs-helpers"
import { findOrdoFile } from "$core/utils/fs-helpers"
import { lazyBox } from "$core/utils/lazy-box"

export default function MdEditor() {
  const dispatch = useAppDispatch()

  const tree = useAppSelector((state) => state.app.personalProject)

  const editorSelector = useExtensionSelector<EditorExtensionStore>()
  const pluginExtensions = useAppSelector((state) => state.app.editorPluginExtensions)

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [plugins, setPlugins] = useState<EditorPlugin[]>([])

  const editorRef = useRef<Editor>(null)

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

  const [query] = useSearchParams()
  const { files } = useFSAPI()

  const path = query.get("path")
  const breadcrumbsPath = getParentPath(path ?? "/")

  useEffect(() => {
    if (!path || !files || !tree) return

    files.get(path).then((payload) => {
      const file = findOrdoFile(path, tree)

      if (file) {
        dispatch(selectFile(file))
      }

      const raw = markdownToDraft(payload)
      const contentState = convertFromRaw(raw)

      setEditorState(EditorState.createWithContent(contentState))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, files])

  useEffect(() => {
    if (!path || !files) return

    // TODO: Send to webworker
    const content = editorState.getCurrentContent()
    const raw = convertToRaw(content)
    const markdownString = draftToMarkdown(raw)

    files.update(path, markdownString)
  }, [path, files, editorState])

  const handleEditorClick = lazyBox((box) => box.fold(() => editorRef.current?.focus()))

  return Either.fromNullable(currentFile).fold(Null, (file) => (
    <EditorPage
      title={file.readableName}
      breadcrumbsPath={breadcrumbsPath}
      onClick={handleEditorClick}
    >
      <Editor
        placeholder="Type something..."
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
    </EditorPage>
  ))
}
