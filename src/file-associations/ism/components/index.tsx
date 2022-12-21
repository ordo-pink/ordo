import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import { useFSAPI } from "$core/api/fs.adapter"
import { WorkerMessageData } from "$core/types"

export default function IsmEditor() {
  const [worker] = useState(new Worker(new URL("$file-associations/ism/worker", import.meta.url)))
  const [lines, setLines] = useState<string[][]>([])

  const [query] = useSearchParams()
  const { files } = useFSAPI()

  const path = query.get("path")

  useEffect(() => {
    if (!path || !worker) return

    files.get(path).then((payload) =>
      worker.postMessage({
        // TODO: Move events to enum
        event: "open-file",
        payload,
      }),
    )

    worker.onmessage = ({ data }: MessageEvent<WorkerMessageData<string[][]>>) => {
      setLines(data.payload)
    }

    return () => {
      worker.onmessage = () => void 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker, path])

  return (
    <div className="flex flex-col">
      {lines.map((line, lineIndex) => (
        <div
          className="flex whitespace-nowrap"
          key={lineIndex + 1}
        >
          {line.map((char, charIndex) => (
            <span
              key={`${lineIndex + 1}-${charIndex + 1}`}
              className="whitespace-pre"
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
