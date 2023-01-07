import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"

export default function CommandPalette() {
  const dispatch = useAppDispatch()

  const commands = useAppSelector((state) => state.app.commands)
}
