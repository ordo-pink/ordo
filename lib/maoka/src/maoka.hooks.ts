import { type TMaokaProps, type TNoSpace } from "./maoka.types"

export const set_attribute = (key: string, value: string) => (ctx: TMaokaProps) =>
	void ctx.current_element.setAttribute(key, value)

export const set_class =
	(...classes: string[]) =>
	(ctx: TMaokaProps) =>
		void ctx.current_element.setAttribute("class", classes.join(" "))

export const add_class =
	(...classes: string[]) =>
	(ctx: TMaokaProps) =>
		void classes.forEach(cls => ctx.current_element.classList.add(...cls.split(" ")))

export const remove_class =
	(...classes: string[]) =>
	(ctx: TMaokaProps) =>
		void classes.forEach(cls => ctx.current_element.classList.remove(...cls.split(" ")))

export const replace_class =
	<$TPrev extends string, $TNext extends string>(prev: TNoSpace<$TPrev>, next: TNoSpace<$TNext>) =>
	(ctx: TMaokaProps) =>
		void ctx.current_element.classList.replace(prev, next)

export const set_style =
	(str: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>) => (ctx: TMaokaProps) =>
		void Object.keys(str).forEach(k => ((ctx.current_element.style as any)[k] = (str as any)[k]))

export const listen =
	<K extends keyof HTMLElement>(event: K extends `on${string}` ? K : never, f: HTMLElement[K]) =>
	(ctx: TMaokaProps) =>
		void ((ctx.current_element as unknown as any)[event] = f)

export const set_inner_html = (html: string) => (ctx: TMaokaProps) =>
	void (ctx.current_element.innerHTML = html)

export const create_context = <$TValue>() => {
	const state = {} as Record<string, $TValue>

	return {
		provide: (value: $TValue) => (props: TMaokaProps) => {
			if (!state[props.root_id]) state[props.root_id] = value
		},

		consume: (props: TMaokaProps) => {
			return state[props.root_id] ?? ({} as $TValue)
		},
	}
}
