import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  className?: string
}>

export const Fieldset = ({ children, className = "" }: Props) => {
  return (
    <fieldset
      className={`w-full flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center md:justify-between rounded-xl p-8 bg-gradient-to-tr from-stone-100 to-neutral-100 dark:from-stone-600 dark:to-neutral-600 ${className}`}
    >
      {children}
    </fieldset>
  )
}
