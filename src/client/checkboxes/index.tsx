import { disableSideBar } from "@client/app/store"
import Null from "@client/null"
import { useAppDispatch, useAppSelector } from "@client/state"
import { isFolder } from "@core/app/is-folder"
import { OrdoFolder } from "@core/app/types"
import { Checkbox } from "@core/editor/types"
import Either from "@core/utils/either"
import React, { useEffect, useState } from "react"

const collectCheckboxes = (tree: OrdoFolder, checkboxes: Record<string, Checkbox[]> = {}) => {
  for (const child of tree.children) {
    if (isFolder(child)) {
      checkboxes = collectCheckboxes(child, checkboxes)
      continue
    }

    if (child.metadata.checkboxes && child.metadata.checkboxes.length > 0) {
      checkboxes[child.readableName] = child.metadata.checkboxes
    }
  }

  return checkboxes
}

export default function Checkboxes() {
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalDirectory)

  const [checkboxes, setCheckboxes] = useState<Record<string, Checkbox[]>>({})

  useEffect(() => void dispatch(disableSideBar()), [])

  useEffect(() => {
    if (!tree) return

    setCheckboxes(collectCheckboxes(tree))
  }, [tree?.path])

  return Either.fromBoolean(Object.keys(checkboxes).length > 0).fold(Null, () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-2">
      {Object.keys(checkboxes).map((readableName) => (
        <div
          className={`bg-gradient-to-br p-4 shadow-lg break-inside-avoid-column rounded-md mb-2 from-neutral-200 to-stone-200 dark:from-neutral-700 dark:to-stone-700`}
          key={readableName}
        >
          <div className="mb-2 font-bold">{readableName}</div>
          <div className="flex flex-col space-y-1">
            {checkboxes[readableName].map((checkbox, index) => (
              <label className="flex space-x-2 items-center" key={index}>
                <input
                  className="w-8 h-8 md:w-5 md:h-5 accent-emerald-600 shrink-0"
                  type="checkbox"
                  checked={checkbox.checked}
                  onChange={console.log}
                />
                <div>{checkbox.value.slice(4)}</div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  ))
}
