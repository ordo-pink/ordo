import React, { useEffect, useState } from "react"

import Either from "@client/common/utils/either"
import Switch from "@client/common/utils/switch"

import Null from "@client/common/null"

type Props = {
  accelerator?: string
}

export default function Accelerator({ accelerator }: Props) {
  const isDarwin = navigator.appVersion.indexOf("Mac") != -1

  const [split, setSplit] = useState<string[]>([])
  const [alt, setAlt] = useState<string>("Alt")
  const [ctrl, setCtrl] = useState<string>("Ctrl")
  const [key, setKey] = useState<string>("")

  useEffect(() => {
    if (accelerator) setSplit(accelerator.split("+"))
  }, [accelerator])

  useEffect(() => {
    if (split.length === 0) return

    const symbol = split[split.length - 1].toLowerCase()

    const getNewKey = Switch.of(symbol)
      .case("backspace", () => "⌫")
      .case("enter", () => "⏎")
      .default(() => symbol)

    setKey(getNewKey())
  }, [split])

  useEffect(() => {
    if (isDarwin) {
      setCtrl("⌘")
      setAlt("⌥")
    }
  }, [isDarwin])

  return Either.fromNullable(accelerator).fold(Null, () => (
    <div className="flex items-center text-xs space-x-1 ml-6 text-neutral-500">
      {split.includes("ctrl") ? <div className="">{ctrl} +</div> : null}
      {split.includes("shift") ? <div className="">⇧ +</div> : null}
      {split.includes("alt") ? <div className="">{alt} +</div> : null}
      <div className="">{key.toLocaleUpperCase()}</div>
    </div>
  ))
}
