import Editor from "@draft-js-plugins/editor"
import { ContentBlock, convertFromRaw, convertToRaw, EditorState } from "draft-js"
import createPrismPlugin from "draft-js-prism-plugin"
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
import { getParentPath } from "$core/utils/fs-helpers"
import { findOrdoFile } from "$core/utils/fs-helpers"
import { lazyBox } from "$core/utils/lazy-box"

import createMarkdownShortcutsPlugin from "$editor-plugins/markdown-shortcuts"

import "prismjs/components/prism-python"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"
import "draft-js/dist/Draft.css"

const markdownShortcutsPlugin = createMarkdownShortcutsPlugin()
const prismPlugin = createPrismPlugin({
  prism: Prism,
})

export default function MdEditor() {
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
  const breadcrumbsPath = getParentPath(path ?? "/")

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
        blockRendererFn={blockRendererFn}
        editorState={editorState}
        plugins={[prismPlugin, markdownShortcutsPlugin]}
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
