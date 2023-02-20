import { ThunkFn } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { noOp } from "@ordo-pink/fns"
import { Accelerator } from "@ordo-pink/react-components"
import { PropsWithChildren, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"

type Props = PropsWithChildren<{
  onClick: ThunkFn<void>
  onMouseOver?: ThunkFn<void>
  disabled?: boolean
  className?: string
  outline?: boolean
  hotkey?: string
  center?: boolean
  inverted?: boolean
}>

export default function OrdoButton({
  children,
  onClick,
  disabled,
  className = "",
  hotkey = "",
  onMouseOver = noOp,
  outline = false,
  center = false,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)

  useHotkeys(
    hotkey,
    () => void (ref.current && ref.current.click()),
    { enableOnTags: ["INPUT", "TEXTAREA"] },
    [ref.current, hotkey],
  )

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      className={`text-sm px-6 py-2 rounded-md shrink-0 ${outline ? "border-2" : ""} ${className}`}
      disabled={disabled}
    >
      <div className={`flex items-center space-x-2 ${center ? "justify-center" : ""}`}>
        <div className="shrink-0">{children}</div>

        {hotkey && !disabled ? (
          <div className="shrink-0 hidden md:block text-xs border border-neutral-400 dark:border-neutral-300 rounded-md px-1 py-0.5">
            <Accelerator accelerator={hotkey} />
          </div>
        ) : null}
      </div>
    </button>
  )
}

export const OrdoButtonPrimary = ({
  children,
  onClick,
  className,
  onMouseOver,
  hotkey,
  disabled,
  inverted,
  outline,
  center,
}: Props) => {
  let buttonClassNames: string

  if (disabled) {
    buttonClassNames =
      "bg-gradient-to-br from-slate-300 via-zinc-300 to-stone-300 dark:from-slate-900 dark:via-zinc-900 dark:to-stone-900"
  } else if (inverted) {
    buttonClassNames =
      "bg-gradient-to-br from-purple-600 via-violet-600 to-purple-600 active-ring text-neutral-200"
  } else {
    buttonClassNames =
      "bg-gradient-to-br from-sky-200 dark:from-purple-600 via-violet-200 dark:via-violet-600 to-purple-200 dark:to-purple-600 active-ring"
  }

  const classNames = `${buttonClassNames} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={classNames}
      outline={outline}
      center={center}
    >
      {children}
    </OrdoButton>
  )
}

export const OrdoButtonSecondary = ({
  children,
  onClick,
  className,
  onMouseOver,
  hotkey,
  disabled,
  outline,
  center,
}: Props) => {
  const buttonAppearanceClass = Either.fromBoolean(!!disabled).fold(
    () => "text-neutral-600 dark:text-neutral-300 passive-ring",
    () => "text-neutral-600 dark:text-neutral-300",
  )

  const buttonClass = `${buttonAppearanceClass} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={buttonClass}
      outline={outline}
      center={center}
    >
      {children}
    </OrdoButton>
  )
}

export const OrdoButtonSuccess = ({
  children,
  onClick,
  className,
  onMouseOver,
  hotkey,
  disabled,
  outline,
  center,
}: Props) => {
  const buttonAppearanceClass = Either.fromBoolean(!!disabled).fold(
    () =>
      "bg-gradient-to-r from-sky-200 dark:from-cyan-600 via-teal-200 dark:via-teal-600 to-emerald-200 dark:to-emerald-600 active-ring",
    () =>
      "bg-gradient-to-r from-slate-300 via-zinc-300 to-stone-300 dark:from-slate-900 dark:via-zinc-900 dark:to-stone-900",
  )

  const buttonClass = `${buttonAppearanceClass} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={buttonClass}
      outline={outline}
      center={center}
    >
      {children}
    </OrdoButton>
  )
}

export const OrdoButtonNeutral = ({
  children,
  onClick,
  className,
  onMouseOver,
  hotkey,
  disabled,
  outline,
  center,
}: Props) => {
  const buttonAppearanceClass = Either.fromBoolean(!!disabled).fold(
    () =>
      "bg-gradient-to-r from-neutral-300 via-stone-300 to-neutral-300 dark:from-neutral-600 dark:via-stone-600 dark:to-neutral-600 active-ring",
    () =>
      "bg-gradient-to-r from-slate-300 via-zinc-300 to-stone-300 dark:from-slate-900 dark:via-zinc-900 dark:to-stone-900",
  )

  const buttonClass = `${buttonAppearanceClass} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={buttonClass}
      outline={outline}
      center={center}
    >
      {children}
    </OrdoButton>
  )
}
