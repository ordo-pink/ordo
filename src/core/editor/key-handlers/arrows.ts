import { CaretRange, RootNode } from "../types"

export const handleArrowUp = (caretRanges: CaretRange[]) => (root: RootNode) => {
  const ranges = [...caretRanges]

  ranges.forEach((range) => {
    const isFirstLine = range.start.line === 1

    if (isFirstLine) {
      range.start.column = 0
      return
    }

    range.start.line -= 1

    const lineIndex = range.start.line - 1
    const line = root.children[lineIndex]
    const lastColumn = line.position.end.column - 1

    if (lastColumn < range.start.column) {
      range.start.column = lastColumn
    }

    // TODO: 85

    // TODO: 86. This might happen if there is a dead caret in the document
    // const relatedLine = root.children.find((node) => node.position.start.line === range.start.line)
    // if (!relatedLine) return
    // const relatedTextNode = relatedLine?.children.find(
    //   (node) =>
    //     node.position &&
    //     node.position.start.column >= range.start.column &&
    //     node.position.end.column <= range.start.column
    // )
    // if (relatedLine.position.end)
    // TODO: 85
  })

  return ranges
}

export const handleArrowDown = (caretRanges: CaretRange[]) => (root: RootNode) => {
  const ranges = [...caretRanges]

  ranges.forEach((range) => {
    const isLastLine = range.start.line === root.children.length
    if (!isLastLine) {
      range.start.line += 1

      const lineIndex = range.start.line - 1
      const line = root.children[lineIndex]
      const lastColumn = line.position.end.column - 1

      if (lastColumn < range.start.column) {
        range.start.column = lastColumn
      }

      return
    }

    const lastLineIndex = root.children.length - 1
    const lastLine = root.children[lastLineIndex]
    const lastColumn = lastLine.position.end.column - 1

    range.start.column = lastColumn

    // TODO: 85
  })

  return ranges
}

export const handleArrowLeft = (caretRanges: CaretRange[]) => (root: RootNode) => {
  const ranges = [...caretRanges]

  ranges.forEach((range) => {
    const isFirstLine = range.start.line === 1
    const isFirstColumn = range.start.column === 0

    // Do nothing because the caret is at the very beginning of the file
    if (isFirstLine && isFirstColumn) return

    if (isFirstColumn) {
      range.start.line -= 1

      const lineIndex = range.start.line - 1
      const line = root.children[lineIndex]
      const lastColumn = line.position.end.column - 1

      range.start.column = lastColumn
      return
    }

    range.start.column -= 1

    // TODO: 85
  })

  return ranges
}

export const handleArrowRight = (caretRanges: CaretRange[]) => (root: RootNode) => {
  const ranges = [...caretRanges]

  ranges.forEach((range) => {
    const isLastLine = range.start.line === root.children.length

    const line = root.children[range.start.line - 1]
    const lastColumn = line.position.end.column - 1
    const isLastColumn = range.start.column === lastColumn

    // Do nothing because the caret is at the very end of the document
    if (isLastLine && isLastColumn) return

    if (isLastColumn) {
      range.start.line += 1
      range.start.column = 0
      return
    }

    range.start.column += 1

    // TODO: 85
  })

  return ranges
}
