import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { database$ } from "../database.state"

const StyledColumnResizer = MaokaStyled.Tags.div("database_table-head_cell-resizer")

export const ColumnResizer = (column: string) =>
	StyledColumnResizer(({ use }) => {
		const handle_mount = () => {
			let current_column: HTMLElement | null
			let page_x: number | null
			let current_column_width: number | null
			let new_width: number | null

			const handle_mouse_down = (event: MouseEvent) => {
				event.stopPropagation()

				const target = event.target as HTMLElement
				current_column = target.parentElement
				page_x = event.pageX
				current_column_width = current_column?.offsetWidth ?? null
			}

			const handle_mouse_move = (event: MouseEvent) => {
				if (current_column) {
					const diff_x = event.pageX - (page_x ?? 0)

					if (current_column_width) {
						new_width = current_column_width + diff_x
						current_column.style.width = `${new_width}px`
					}
				}
			}

			const handle_mouse_up = (event: MouseEvent) => {
				event.stopPropagation()

				database$.update("width", state_width => {
					if (!new_width) return state_width
					if (!state_width) state_width = {}

					const width_copy = { ...state_width }

					width_copy[column] = new_width

					return width_copy
				})

				current_column = null
				page_x = null
				current_column_width = null
				new_width = null
			}

			const handle_click = (event: MouseEvent) => event.stopPropagation()

			use(MaokaJabs.listen("onmousedown", handle_mouse_down))
			use(MaokaJabs.listen("onclick", handle_click))

			document.addEventListener("mousemove", handle_mouse_move)
			document.addEventListener("mouseup", handle_mouse_up)

			return () => {
				document.removeEventListener("mousemove", handle_mouse_move)
				document.removeEventListener("mouseup", handle_mouse_up)
			}
		}

		use(MaokaDOM.Jabs.onmount(handle_mount))
	})
