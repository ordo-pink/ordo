export const setCaretPosition = (container: Node, position: number): void => {
	if (position < 0) {
		return
	}

	const selection = window.getSelection()
	const range = createRange(container, { count: position })

	if (range != null) {
		range.collapse(false)
		selection.removeAllRanges()
		selection.addRange(range)
	}
}

export const getCaretPosition = (container: Node): number => {
	const { focusNode, focusOffset } = window.getSelection()
	let offset = -1
	let node: Node

	if (focusNode != null) {
		if (isChildOf(focusNode, container)) {
			node = focusNode
			offset = focusOffset

			while (node != null) {
				if (node == container) {
					break
				}

				if (node.previousSibling != null) {
					node = node.previousSibling
					offset += node.textContent.length
				} else {
					node = node.parentNode

					if (node == null) {
						break
					}
				}
			}
		}
	}

	return offset
}

const isChildOf = (node: Node, parent: Node): boolean => {
	while (node != null) {
		if (node == parent) {
			return true
		}

		node = parent
	}

	return false
}

const createRange = (node: Node, chars: { count: number }, range: Range = null) => {
	if (!range) {
		range = document.createRange()
		range.selectNode(node)
		range.setStart(node, 0)
	}

	if (chars.count === 0) {
		range.setEnd(node, chars.count)
	} else if (node && chars.count > 0) {
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.textContent.length < chars.count) {
				chars.count -= node.textContent.length
			} else {
				range.setEnd(node, chars.count)
				chars.count = 0
			}
		} else {
			for (let lp = 0; lp < node.childNodes.length; lp++) {
				range = createRange(node.childNodes[lp], chars, range)

				if (chars.count === 0) {
					break
				}
			}
		}
	}

	return range
}
