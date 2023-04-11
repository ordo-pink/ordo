import { ThunkFn, UnaryFn } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { noOp } from "@ordo-pink/fns"
import { MouseEvent, PropsWithChildren, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Accelerator } from "../accelerator/accelerator"

import "./buttons.css"

type Props = PropsWithChildren<{
  onClick: ThunkFn<void> | UnaryFn<MouseEvent<HTMLButtonElement>, void>
  onMouseOver?: ThunkFn<void>
  disabled?: boolean
  className?: string
  outline?: boolean
  hotkey?: string
  center?: boolean
  inverted?: boolean
  compact?: boolean
}>

export const OrdoButton = ({
  children,
  onClick,
  disabled,
  className = "",
  hotkey = "",
  onMouseOver = noOp,
  outline = false,
  center = false,
  compact = false,
}: Props) => {
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
      className={`button ${outline ? "button-outline" : ""} ${className} ${
        compact ? "button-compact" : "button-normal"
      }`}
      disabled={disabled}
    >
      <div className={`button-content ${center ? "button-content-center" : ""}`}>
        <div className="shrink-0">{children}</div>

        {hotkey ? (
          <div className={`button-accelerator ${!disabled && "visible"}`}>
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
  compact,
}: Props) => {
  let buttonClassNames: string

  if (disabled) {
    buttonClassNames = "button-primary-disabled"
  } else if (inverted) {
    buttonClassNames = "button-primary-inverted"
  } else {
    buttonClassNames = ""
  }

  const classNames = `button-primary ${buttonClassNames} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={classNames}
      outline={outline}
      center={center}
      compact={compact}
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
  inverted,
  outline,
  center,
  compact,
}: Props) => {
  let buttonClassNames: string

  if (disabled) {
    buttonClassNames = "button-secondary-disabled"
  } else if (inverted) {
    buttonClassNames = "button-secondary-inverted"
  } else {
    buttonClassNames = ""
  }

  const buttonClass = `button-secondary ${buttonClassNames} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={buttonClass}
      outline={outline}
      center={center}
      compact={compact}
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
  compact,
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
      compact={compact}
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
  inverted,
  outline,
  center,
  compact,
}: Props) => {
  let buttonClassNames: string

  if (disabled) {
    buttonClassNames = "button-neutral-disabled"
  } else if (inverted) {
    buttonClassNames = "button-neutral-inverted"
  } else {
    buttonClassNames = ""
  }

  const buttonClass = `button-neutral ${buttonClassNames} ${className}`

  return (
    <OrdoButton
      onClick={onClick}
      onMouseOver={onMouseOver}
      disabled={disabled}
      hotkey={hotkey}
      className={buttonClass}
      outline={outline}
      center={center}
      compact={compact}
    >
      {children}
    </OrdoButton>
  )
}
