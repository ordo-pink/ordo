import type { OrdoDate, RootNode } from "@core/editor/types"

import { createRoot } from "@core/app/parsers/create-root"

export const parseOrdoFile = (raw: string): RootNode => {
  const root = createRoot(raw)

  return root
}

export const parseMetadata = (tree: RootNode) => {
  const extract = createExtractor()

  extract(tree)

  return tree
}

const createExtractor = () => (tree: RootNode) => {
  const tagRx = /--([\p{L}\d./-]+)/giu
  const checkboxRx = /^\([*\s]\)\s.*/
  const linkRx = /\(\(([\p{L}\d/-]+)\)\)/giu
  const dateRx = /!?!\(\d{4}-\d{2}-\d{2}\)/g
  const dateWithPatternRx = /(!?!\(\d{4}-\d{2}-\d{2}\+[0-9*]{5}\))/g
  // TODO: 75
  // TODO: 76

  for (let i = 0; i < tree.children.length; i++) {
    for (let ci = 0; ci < tree.children[i].children.length; ci++) {
      const node = tree.children[i].children[ci]

      if (!node.value) {
        continue
      }

      if (tagRx.test(node.value)) {
        const tags = node.value.match(tagRx) as string[]
        const organizedTags = tags.map((tag) => tag.slice(2))
        tree.data.tags = Array.from(new Set(tree.data.tags.concat(organizedTags)))
      }

      if (checkboxRx.test(node.value)) {
        const checked = node.value.startsWith("(*) ")

        tree.data.checkboxes.push({
          checked,
          value: node.value,
        })
      }

      if (linkRx.test(node.value)) {
        const links = node.value.match(linkRx) as string[]
        const organizedLinks = links.map((link) => ({
          embed: link.startsWith("!"),
          href: link.slice(2, -2),
        }))

        tree.data.links = Array.from(new Set(tree.data.links.concat(organizedLinks)))
      }

      if (dateRx.test(node.value)) {
        const dates = node.value.match(dateRx) as string[]
        const organizedDates: OrdoDate[] = dates.map((date) => {
          const remind = date.startsWith("!!")
          const isoDate = date.slice(remind ? 3 : 2, -1)

          return {
            remind,
            start: new Date(isoDate),
          }
        })

        organizedDates.forEach((date) => {
          if (
            !tree.data.dates.some(
              (existingDate) => existingDate.start.toDateString() === date.start.toDateString()
            )
          ) {
            tree.data.dates.push(date)
          }
        })
      }

      if (dateWithPatternRx.test(node.value)) {
        const dates = node.value.match(dateWithPatternRx) as string[]
        const organizedDates: OrdoDate[] = dates.map((date) => {
          const remind = date.startsWith("!!")
          const repeatPattern = date.slice(remind ? 14 : 13, -1)
          const isoDate = date.slice(remind ? 3 : 2, -7)

          return {
            remind,
            start: new Date(isoDate),
            repeatPattern,
          }
        })

        organizedDates.forEach((date) => {
          if (
            !tree.data.dates.some(
              (existingDate) => existingDate.start.toDateString() === date.start.toDateString()
            )
          ) {
            tree.data.dates.push(date)
          }
        })
      }
    }
  }
}

// TODO 77
// @example ((folder/another-file.mdo)), ((photos/2022/img.png))
// TODO 78
// @example !((folder/another-file.mdo))

// TODO 79
// @example !2022-09-25, !2022-09-25T09:03:47.133Z
// @example !2022-09-25--00***--2022-10-25 - Appear daily at midnight since Sep 25, 2022 till Oct 25, 2022
// @example !(2022-09-25T09:00:00.133Z--****7--2022-12-31) - Remind every Sunday at 9am since Sep 25, 2022 till Dec 31, 2022
// TODO 80
// TODO 81
// TODO 82
// @example !!2022-09-25--00***--2022-10-25 - Appear daily at midnight since Sep 25, 2022 till Oct 25, 2022

// TODO: 83
// TODO: 84
