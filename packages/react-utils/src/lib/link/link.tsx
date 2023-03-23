import { MouseEvent, PropsWithChildren, HTMLProps } from "react"
import { useCommands } from "../hooks/use-commands"

type Props = HTMLProps<HTMLAnchorElement> &
  PropsWithChildren<{
    href: string
    className?: string
  }>

export const Link = ({ href, children, className }: Props) => {
  const { emit: execute } = useCommands()

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    execute("router.navigate", href)
  }

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
