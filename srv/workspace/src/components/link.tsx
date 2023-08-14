import { MouseEvent, PropsWithChildren, HTMLProps } from "react"
import { useCommands } from "../hooks/use-commands"

type Props = HTMLProps<HTMLAnchorElement> &
	PropsWithChildren<{
		href: string
		className?: string
		external?: boolean
		newTab?: boolean
	}>

export const Link = ({ href, children, className, external = false, newTab = false }: Props) => {
	const commands = useCommands()

	const handleClick = (event: MouseEvent) => {
		event.preventDefault()

		external
			? commands.emit("router.open-external", { url: href })
			: commands.emit("router.navigate", { url: href, newTab })
	}

	return (
		<a href={href} className={className} onClick={handleClick}>
			{children}
		</a>
	)
}
