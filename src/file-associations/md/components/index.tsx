import { ContentBlock, convertFromRaw, convertToRaw, EditorState } from "draft-js"
import createMarkdownShortcutsPlugin from "draft-js-markdown-shortcuts-plugin"
import Editor from "draft-js-plugins-editor"
import createPrismPlugin from "draft-js-prism-plugin"
import { clearEmptyBlocks, clearPastedStyle, replaceTextRegex } from "draft-regex"
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js"
import Prism from "prismjs"
import { useState, useCallback, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import { selectFile } from "$activities/editor/store"

import { useFSAPI } from "$core/hooks/use-fs-api"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
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

  return (
    <div
      className="prose prose-pink w-full h-full max-h-screen caret-purple-800 dark:prose-invert dark:caret-purple-200 cursor-text"
      onClick={() => editorRef.current && editorRef.current.focus()}
      role="none"
    >
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
    </div>
  )
}
