import { WorkerMessageData } from "$core/types"

onmessage = (message: MessageEvent<WorkerMessageData<string>>) => {
  const { event, payload } = message.data

  // TODO: Move events to enum
  if (event === "open-file") {
    postMessage({
      event: "open-file",
      payload: payload.split("\n").map((line) => line.split("")),
    })
  }
}
