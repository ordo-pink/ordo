import { read_file0, write_file0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { is_string } from "@ordo-pink/tau"

const main = () =>
	read_file0("lib/emojis/src/v16/spec.txt", "utf8")
		.pipe(Oath.ops.chain(content => Oath.If(is_string(content), { T: () => content as string })))
		.pipe(Oath.ops.map(content => content.split("\n")))
		.pipe(Oath.ops.map(lines => lines.filter(line => !line.startsWith("#"))))
		.pipe(Oath.ops.map(lines => lines.filter(line => !!line.trim())))
		.pipe(Oath.ops.map(lines => lines.map(line => line.split("#"))))
		.pipe(
			Oath.ops.map(lines =>
				lines.map(line => line.flatMap((item, index) => (index === 0 ? item.split(";") : item))),
			),
		)
		.pipe(
			Oath.ops.map(lines =>
				lines.map(line => {
					const meta_info_str = line[2]?.trim()
					const icon = meta_info_str.slice(0, meta_info_str.indexOf(" "))
					const description = meta_info_str.slice(meta_info_str.indexOf(" ")).trim()

					return {
						code_point: line[0]?.trim(),
						status: line[1]?.trim(),
						icon: icon.trim(),
						version: description.slice(0, description.indexOf(" ")).trim(),
						description: description.slice(description.indexOf(" ")).trim(),
					}
				}),
			),
		)
		.pipe(
			Oath.ops.map(
				content => `export type TEmojiStatus = "component" | "fully-qualified" | "minimally-qualified" | "unqualified"

export type TEmoji = {
	code_point: string
	status: TEmojiStatus
	icon: string
	version: string
	description: string
}
			
export const emojis: TEmoji[] = ${JSON.stringify(content, null, 2)}`,
			),
		)
		.pipe(Oath.ops.chain(json => write_file0("lib/emojis/index.ts", json, "utf8")))
		.invoke(Oath.invokers.or_else(console.error))

void main()
