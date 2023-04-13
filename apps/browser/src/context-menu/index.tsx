import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Null, useSubscription } from "@ordo-pink/react-utils"
import {
  ContextMenuItem as TContextMenuItem,
  hideContextMenu,
} from "@ordo-pink/stream-context-menu"
import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Observable } from "rxjs"
import ContextMenuItem from "./item"

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state$: Observable<Nullable<{ x: number; y: number; target: any; structure: TContextMenuItem[] }>>
}

export default function ContextMenu({ state$ }: Props) {
  const state = useSubscription(state$)

  useHotkeys("Esc", () => {
    hideContextMenu()
  })

  const [create, setCreate] = useState<TContextMenuItem[]>([])
  const [read, setRead] = useState<TContextMenuItem[]>([])
  const [update, setUpdate] = useState<TContextMenuItem[]>([])
  const [_delete, setDelete] = useState<TContextMenuItem[]>([])

  useEffect(() => {
    if (!state) {
      setCreate([])
      setRead([])
      setUpdate([])
      setDelete([])

      return
    }

    const createCommands = [] as TContextMenuItem[]
    const updateCommands = [] as TContextMenuItem[]
    const readCommands = [] as TContextMenuItem[]
    const deleteCommands = [] as TContextMenuItem[]

    state.structure.forEach((item) => {
      if (item.type === "create") createCommands.push(item)
      else if (item.type === "read") readCommands.push(item)
      else if (item.type === "update") updateCommands.push(item)
      else if (item.type === "delete") deleteCommands.push(item)
    })

    setCreate(createCommands)
    setRead(readCommands)
    setUpdate(updateCommands)
    setDelete(deleteCommands)
  }, [state])

  return (
    <div
      style={{ top: state?.y ?? -50, left: state?.x ?? -50 }}
      className={`absolute z-[1000] bg-white dark:bg-neutral-500 shadow-lg transition-opacity w-80 duration-300 rounded-lg p-2 ${
        state && state.structure.length ? "opacity-100" : "opacity-0"
      }`}
    >
      {state ? (
        <div className="flex flex-col divide-y">
          {Either.fromBoolean(create.length > 0).fold(Null, () => (
            <div className="py-2">
              {create.map((item) => (
                <ContextMenuItem
                  key={item.name}
                  item={item}
                  state={{ ...state, structure: create }}
                />
              ))}
            </div>
          ))}

          {Either.fromBoolean(read.length > 0).fold(Null, () => (
            <div className="py-2">
              {read.map((item) => (
                <ContextMenuItem
                  key={item.name}
                  item={item}
                  state={{ ...state, structure: read }}
                />
              ))}
            </div>
          ))}

          {Either.fromBoolean(update.length > 0).fold(Null, () => (
            <div className="py-2">
              {update.map((item) => (
                <ContextMenuItem
                  key={item.name}
                  item={item}
                  state={{ ...state, structure: update }}
                />
              ))}
            </div>
          ))}

          {Either.fromBoolean(_delete.length > 0).fold(Null, () => (
            <div className="py-2">
              {_delete.map((item) => (
                <ContextMenuItem
                  key={item.name}
                  item={item}
                  state={{ ...state, structure: _delete }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
