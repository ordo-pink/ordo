import React, { FC, useEffect, useState } from "react"

import Either from "@client/common/utils/either"
import Switch from "@client/common/utils/switch"

import Null from "@client/common/components/null"
import { useIcon } from "@client/common/hooks/use-icon"

type Props = {
  accelerator?: string
}

export default function Accelerator({ accelerator }: Props) {
  const isDarwin = navigator.appVersion.indexOf("Mac") != -1

  const [split, setSplit] = useState<string[]>([])
  const [alt, setAlt] = useState<string>("Alt")
  const [ctrl, setCtrl] = useState<string>("Ctrl")
  const [Key, setKey] = useState<FC<{ className?: string }>>(() => Null)

  const EnterIcon = useIcon("AiOutlineEnter")
  const BackspaceIcon = useIcon("BsBackspace")

  useEffect(() => {
    if (accelerator) setSplit(accelerator.split("+"))
  }, [accelerator])

  useEffect(() => {
    if (split.length === 0) return

    const symbol = split[split.length - 1].toLowerCase()

    const newKey = Switch.of(symbol)
      .case("backspace", () => () => <BackspaceIcon />)
      .case("enter", () => () => <EnterIcon />)
      .case("escape", () => () => <span>ESC</span>)
      .default(() => () => <span>{symbol.toLocaleUpperCase()}</span>)

    setKey(newKey)
  }, [split])

  useEffect(() => {
    if (isDarwin) {
      setCtrl("⌘")
      setAlt("⌥")
    }
  }, [isDarwin])

  return Either.fromNullable(accelerator).fold(Null, () => (
    <div className="flex items-center space-x-1 text-neutral-400 dark:text-neutral-300">
      {split.includes("ctrl") ? <div className="">{ctrl} +</div> : null}
      {split.includes("shift") ? <div className="">⇧ +</div> : null}
      {split.includes("alt") ? <div className="">{alt} +</div> : null}
      <Key className="shrink-0" />
    </div>
  ))
}
