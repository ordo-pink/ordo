import { IOrdoFile, Nullable, OrdoExtensionType, UnaryFn } from "@ordo-pink/core"
import { useEffect, useState } from "react"
import { ActionContext, OrdoExtension, OrdoCommand } from "$core/types"

const macOSAcceleratorMap = {
  ctrl: "cmd",
  control: "cmd",
  alt: "option",
}

const nonMacOSAcceleratorMap = {
  cmd: "ctrl",
  command: "ctrl",
  option: "alt",
}
const acceleratorMapper = (accelerator: string, isMac: boolean) => {
  const acceleratorLC = accelerator.toLowerCase()
  const toReplace = isMac ? /(control|ctrl|alt)/g : /(cmd|command|option)/g
  return acceleratorLC.replace(toReplace, (m) =>
    isMac
      ? macOSAcceleratorMap[m as keyof typeof macOSAcceleratorMap]
      : nonMacOSAcceleratorMap[m as keyof typeof nonMacOSAcceleratorMap],
  )
}

const useSystemCommands = (
  extensions: OrdoExtension<string, OrdoExtensionType>[],
  commands: OrdoCommand<string>[],
  currentFile: Nullable<IOrdoFile>,
) => {
  const [accelerators, setAccelerators] = useState<Record<string, UnaryFn<ActionContext, void>>>({})

  const isMac = navigator.userAgent.indexOf("Mac") !== -1

  useEffect(() => {
    if (!extensions) return

    const keybindings: Record<string, UnaryFn<ActionContext, void>> = {}

    commands.forEach((command) => {
      if (command.accelerator) {
        const accelerator = acceleratorMapper(command.accelerator, isMac)
        keybindings[accelerator] = command.action
      }
    })

    setAccelerators(() => keybindings)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands, currentFile])

  return accelerators
}

export { useSystemCommands }
