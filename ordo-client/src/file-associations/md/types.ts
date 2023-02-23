export type WorkerMessageData<T = unknown> = {
  event: string
  payload: T
}
