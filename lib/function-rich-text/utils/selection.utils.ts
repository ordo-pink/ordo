export const get_window_selection_offsets = () => {
	const selection = window.getSelection()

	const anchor_offset = selection?.anchorOffset ?? 0
	const focus_offset = selection?.focusOffset ?? 0

	return { anchor_offset, focus_offset }
}
