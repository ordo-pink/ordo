import { ContentBlock, convertFromRaw, convertToRaw, Editor, EditorState } from "draft-js"
import { markdownToDraft, draftToMarkdown } from "markdown-draft-js"
import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import { useFSAPI } from "$core/hooks/use-fs-api"
import { useAppSelector } from "$core/state/hooks/use-app-selector"

export default function IsmEditor() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

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
      const raw = markdownToDraft(payload)
      const contentState = convertFromRaw(raw)
      setEditorState(EditorState.createWithContent(contentState))
    })
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
    <div className="prose prose-pink w-full h-full max-h-screen caret-purple-800 dark:caret-purple-200">
      <Editor
        blockRendererFn={blockRendererFn}
        editorState={editorState}
        onChange={(state) => {
          setEditorState(state)
        }}
      />
    </div>
  )
}
