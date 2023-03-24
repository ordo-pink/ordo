import { Nullable } from "@ordo-pink/common-types"
import { useSubscription } from "@ordo-pink/react-utils"
import {
  ContextMenuItem as TContextMenuItem,
  hideContextMenu,
} from "@ordo-pink/stream-context-menu"
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

  return (
    <div
      style={{ top: state?.y ?? -50, left: state?.x ?? -50 }}
      className={`absolute z-[1000] bg-neutral-200 dark:bg-neutral-500 shadow-lg transition-opacity w-80 duration-300 rounded-lg p-2 ${
        state && state.structure.length ? "opacity-100" : "opacity-0"
      }`}
    >
      {state ? (
        <div>
          {state.structure.map((item) => (
            <ContextMenuItem
              key={item.name}
              item={item}
              state={state}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
