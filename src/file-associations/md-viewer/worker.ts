import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { WorkerMessageData } from "$core/types"

// @see https://unifiedjs.com/learn/recipe/remark-html/
onmessage = (message: MessageEvent<WorkerMessageData>) => {
  const { event } = message.data

  if (event === "open-file") {
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
        postMessage({
          event: "open-file",
          payload: String(file),
        })
      })
  }
}
