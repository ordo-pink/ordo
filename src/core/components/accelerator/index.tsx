import { FC, useEffect, useState } from "react"
import { AiOutlineEnter } from "react-icons/ai"
import { BsBackspace } from "react-icons/bs"

import Null from "$core/components/null"
import { Either } from "$core/utils/either"
import { Switch } from "$core/utils/switch"

import "$core/components/accelerator/index.css"

type Props = {
  accelerator?: string
}

export default function Accelerator({ accelerator }: Props) {
  const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

  const [split, setSplit] = useState<string[]>([])
  const [alt, setAlt] = useState<string>("Alt")
  const [ctrl, setCtrl] = useState<string>("Ctrl")
  const [Key, setKey] = useState<FC<{ className?: string }>>(() => Null)

  useEffect(() => {
    if (accelerator) setSplit(accelerator.split("+"))
  }, [accelerator])

  useEffect(() => {
    if (split.length === 0) return

    const symbol = split[split.length - 1].toLowerCase()

    const Enter = () => <AiOutlineEnter />
    const Backspace = () => <BsBackspace />
    const Escape = () => <span>ESC</span>
    const Symbol = () => <span>{symbol.toLocaleUpperCase()}</span>

    const newKey = Switch.of(symbol)
      .case("backspace", () => Backspace)
      .case("enter", () => Enter)
      .case("escape", () => Escape)
      .default(() => Symbol)

    setKey(newKey)
  }, [split])

  useEffect(() => {
    if (isDarwin) {
      setCtrl("⌘")
      setAlt("⌥")
    }
  }, [isDarwin])

  return Either.fromNullable(accelerator).fold(Null, () => (
    <div className="accelerator">
      {split.includes("alt") ? (
        <div className="">{alt} +</div> /* eslint-disable-line i18next/no-literal-string */
      ) : null}
      {split.includes("option") ? (
        <div className="">⌥ +</div> /* eslint-disable-line i18next/no-literal-string */
      ) : null}
      {split.includes("ctrl") ? (
        <div className="">{ctrl} +</div> /* eslint-disable-line i18next/no-literal-string */
      ) : null}
      {split.includes("shift") ? (
        <div className="">⇧ +</div> /* eslint-disable-line i18next/no-literal-string */
      ) : null}
      <Key className="shrink-0" />
    </div>
  ))
}
