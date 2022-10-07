import React, { useEffect, useState } from "react"

import Either from "@core/utils/either"

import Null from "@client/null"

type TProps = {
  accelerator?: string
}

export default function Accelerator({ accelerator }: TProps) {
  const isDarwin = navigator.appVersion.indexOf("Mac") != -1

  const [split, setSplit] = useState<string[]>([])
  const [alt, setAlt] = useState<string>("Alt")
  const [ctrl, setCtrl] = useState<string>("Ctrl")

  useEffect(() => {
    if (accelerator) setSplit(accelerator.split("+"))
  }, [accelerator])

  useEffect(() => {
    if (isDarwin) {
      setCtrl("⌘")
      setAlt("⌥")
    }
  }, [isDarwin])

  return Either.fromNullable(accelerator).fold(Null, () => (
    <div className="flex items-center text-xs space-x-1 ml-6 text-neutral-500">
      {split.includes("CommandOrControl") ? <div className="">{ctrl} +</div> : null}
      {split.includes("Shift") ? <div className="">⇧ +</div> : null}
      {split.includes("Alt") ? <div className="">{alt} +</div> : null}
      <div className="">{split[split.length - 1]}</div>
    </div>
  ))
}
