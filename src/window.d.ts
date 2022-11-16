import { Action, PayloadAction } from "@reduxjs/toolkit"

declare global {
  interface Window {
    ordo: {
      emit: <Result = void, Payload = unknown>(action: Action | PayloadAction<Payload>) => Result
    }
  }
}
