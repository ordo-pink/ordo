export type Selection = {
	start: number
	end: number
}

export const CaretPositioning: {
	saveSelection: <T extends HTMLElement>(element: T) => Selection
	restoreSelection: <T extends HTMLElement>(element: T, selection: Selection) => void
} = {} as any

if (window.getSelection && document.createRange) {
	//saves caret position(s)
	CaretPositioning.saveSelection = function (containerEl) {
		const range = window.getSelection().getRangeAt(0)
		const preSelectionRange = range.cloneRange()
		preSelectionRange.selectNodeContents(containerEl)
		preSelectionRange.setEnd(range.startContainer, range.startOffset)
		const start = preSelectionRange.toString().length

		return {
			start: start,
			end: start + range.toString().length,
		}
	}
	//restores caret position(s)
	CaretPositioning.restoreSelection = function (containerEl, savedSel) {
		let charIndex = 0
		const range = document.createRange()
		range.setStart(containerEl, 0)
		range.collapse(true)
		const nodeStack = [containerEl]
		let node
		let foundStart = false
		let stop = false

		while (!stop && (node = nodeStack.pop())) {
			if (node.nodeType === 3) {
				const nextCharIndex = charIndex + (node as any).length
				if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
					range.setStart(node, savedSel.start - charIndex)
					foundStart = true
				}
				if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
					range.setEnd(node, savedSel.end - charIndex)
					stop = true
				}
				charIndex = nextCharIndex
			} else {
				let i = node.childNodes.length
				while (i--) {
					nodeStack.push(node.childNodes[i] as any)
				}
			}
		}

		const sel = window.getSelection()
		sel.removeAllRanges()
		sel.addRange(range)
	}
} else if ((document as any).selection && (document.body as any).createTextRange) {
	//saves caret position(s)
	CaretPositioning.saveSelection = function (containerEl) {
		const selectedTextRange = (document as any).selection.createRange()
		const preSelectionTextRange = (document.body as any).createTextRange()
		preSelectionTextRange.moveToElementText(containerEl)
		preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange)
		const start = preSelectionTextRange.text.length

		return {
			start: start,
			end: start + selectedTextRange.text.length,
		}
	}
	//restores caret position(s)
	CaretPositioning.restoreSelection = (containerEl, savedSel) => {
		const textRange = (document.body as any).createTextRange()
		textRange.moveToElementText(containerEl)
		textRange.collapse(true)
		textRange.moveEnd("character", savedSel.end)
		textRange.moveStart("character", savedSel.start)
		textRange.select()
	}
}
