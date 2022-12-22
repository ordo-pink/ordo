import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { useFSAPI } from "$core/api/fs.adapter"

export default function MdViewer() {
  const [content, setContent] = useState<string>("")

  const [query] = useSearchParams()
  const { files } = useFSAPI()

  const path = query.get("path")

  useEffect(() => {
    if (!path) return

    files.get(path).then((payload) =>
      unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(payload)
        .then((file) => {
          setContent(String(file))
        }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  return (
    <div
      className="prose prose-a:underline prose-pink dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
