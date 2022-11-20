import { WorkerMessageData } from "$file-associations/ism/types"

onmessage = (message: MessageEvent<WorkerMessageData>) => {
  const { event } = message.data

  if (event === "open-file") {
    postMessage({
      event: "open-file",
      payload: "WOOOOHOOOOO".split("\n").map((line) => line.split("")),
    })
  }
}
