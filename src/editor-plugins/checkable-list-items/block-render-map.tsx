import { Map } from "immutable"

import {
  CHECKABLE_LIST_ITEM,
  UNORDERED_LIST_ITEM,
} from "$editor-plugins/checkable-list-items/constants"

// https://github.com/facebook/draft-js/blob/0.10-stable/src/model/immutable/DefaultDraftBlockRenderMap.js#L22
// <ul className={cx('public/DraftStyleDefault/ul')} />
export const WRAPPER = <ul className="public-DraftStyleDefault-ul" />

export const blockRenderMap = Map({
  [CHECKABLE_LIST_ITEM]: {
    element: "li",
    wrapper: WRAPPER,
  },
})

export const blockRenderMapForSameWrapperAsUnorderedListItem = blockRenderMap.merge(
  Map({
    [UNORDERED_LIST_ITEM]: {
      element: "li",
      wrapper: WRAPPER,
    },
  }),
)

export default blockRenderMap
