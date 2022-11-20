import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import { WorkerMessageData } from "$file-associations/ism/types"

export default function IsmEditor() {
  const [worker] = useState(new Worker(new URL("$file-associations/ism/worker", import.meta.url)))
  const [lines, setLines] = useState<string[][]>([])

  const { path } = useParams()

  useEffect(() => {
    if (!path || !worker) return

    worker.postMessage({
      event: "open-file",
      payload: path,
    })

    worker.onmessage = ({ data }: MessageEvent<WorkerMessageData<string[][]>>) => {
      setLines(data.payload)
    }

    return () => {
      worker.onmessage = () => void 0
    }
  }, [worker, path])

  return (
    <div className="flex flex-col">
      {lines.map((line, lineIndex) => (
        <div
          className="flex"
          key={lineIndex + 1}
        >
          {line.map((char, charIndex) => (
            <div key={`${lineIndex + 1}-${charIndex + 1}`}>{char}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
