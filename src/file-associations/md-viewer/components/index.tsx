import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

export default function MdViewer() {
  const [content, setContent] = useState<string>("")

  const { path } = useParams()

  useEffect(() => {
    if (!path) return

    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(
        `# Test

This is a **MARKDOWN** file test and it should properly \`render\`!  
      `,
      )
      .then((file) => {
        setContent(String(file))
      })
  }, [path])

  return <div dangerouslySetInnerHTML={{ __html: content }} />
}
