import { UnaryFn } from "@ordo-pink/core"
import {
  EditorBlock,
  SelectionState,
  ContentState,
  ContentBlock,
  DraftDecoratorType,
} from "draft-js"
import type { List } from "immutable"

type Props = {
  contentState: ContentState
  block: ContentBlock
  customStyleMap: Record<string, string>
  customStyleFn: UnaryFn<unknown, unknown>
  tree: List<unknown>
  selection: SelectionState
  decorator: DraftDecoratorType
  forceSelection: boolean
  direction: unknown
  blockStyleFn: UnaryFn<unknown, unknown>
  offsetKey: string
  blockProps: {
    onChangeChecked: () => void
    checked: boolean
  }
}

export default function CheckableListItem(props: Props) {
  const {
    offsetKey,
    blockProps: { onChangeChecked, checked },
  } = props

  return (
    <div
      className={`checkable-list-item-block${checked ? " is-checked" : ""}`}
      data-offset-key={offsetKey}
    >
      <div
        className="checkable-list-item-block__checkbox"
        contentEditable={false}
        suppressContentEditableWarning
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChangeChecked}
        />
      </div>
      <div className="checkable-list-item-block__text">
        <EditorBlock {...props} />
      </div>
    </div>
  )
}
