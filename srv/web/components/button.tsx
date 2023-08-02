import { JSX, RenderableProps } from "preact"
import { BsArrowRight } from "#x/react_icons_bs@1.0.8/mod.ts"

type Props = {
	onClick?: JSX.MouseEventHandler<HTMLButtonElement>
	disabled?: boolean
}

export const Button = ({ children, disabled, onClick }: RenderableProps<Props>) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			class="cursor-pointer flex items-center disabled:ring-0 disabled:cursor-not-allowed disabled:bg-neutral-500 space-x-2 bg-stone-900 dark:bg-neutral-100 text-neutral-300 dark:text-neutral-800 max-w-xs self-end px-6 py-1 rounded-md hover:ring-2 hover:ring-pink-300 dark:hover:ring-pink-500 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-500 transition-all duration-300"
		>
			<div>{children}</div>
			<BsArrowRight />
		</button>
	)
}
