import { ContentBlock, convertFromRaw, convertToRaw, EditorState } from "draft-js"
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin"
import Editor from "draft-js-plugins-editor"
import createPrismPlugin from "draft-js-prism-plugin"
import { clearEmptyBlocks, clearPastedStyle } from "draft-regex"
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js"
import Prism from "prismjs"
import { useState, useCallback, useEffect, useRef } from "react"
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
import { findOrdoFile } from "$core/utils/fs-helpers"

import "prismjs/components/prism-python"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"

const markdownShortcutsPlugin = createMarkdownShortcutsPlugin()
const prismPlugin = createPrismPlugin({
  prism: Prism,
})

export default function IsmEditor() {
  const dispatch = useAppDispatch()

  const tree = useAppSelector((state) => state.app.personalProject)

  const editorSelector = useExtensionSelector<EditorExtensionStore>()

  const currentFile = editorSelector((state) => state["ordo-activity-editor"].currentFile)

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  const editorRef = useRef<Editor>(null)

  const ismParsers = useAppSelector((state) => state.app.ismParserExtensions)

  const blockRendererFn = useCallback(
    (block: ContentBlock) => {
      ismParsers.forEach((parser) => {
        if (parser.rules.some((rule) => rule.validate(block))) {
          return {
            component: parser.Component,
            props: {
              block,
            },
          }
        }
      })
    },
    [ismParsers],
  )

  const [query] = useSearchParams()
  const { files } = useFSAPI()

  const path = query.get("path")

  useEffect(() => {
    if (!path || !files) return

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

  return Either.fromNullable(currentFile).fold(Null, (file) => (
    <EditorPage currentFile={file}>
      <Editor
        ref={editorRef}
        blockRendererFn={blockRendererFn}
        editorState={editorState}
        plugins={[prismPlugin, markdownShortcutsPlugin]}
        onChange={(state) => {
          setEditorState(clearEmptyBlocks(state))
        }}
        handlePastedText={(_, __, state) => {
          setEditorState(clearPastedStyle(state))

          return "not-handled"
        }}
      />
    </EditorPage>
  ))
}
