import { IOrdoDirectory, IOrdoFile, Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null, useDrive } from "@ordo-pink/react-utils"
import { reduce } from "ramda"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const sizeReducer = (totalSize: number) => (acc: number, item: IOrdoFile | IOrdoDirectory) =>
  OrdoDirectory.isOrdoDirectory(item) ? acc + calculateTreeSize(item, totalSize) : acc + item.size

// TODO: Persist the data in the backend on create/update and retrieve from there
export const calculateTreeSize = (directory: Nullable<IOrdoDirectory>, size = 0): number =>
  Either.fromNullable(directory)
    .chain((dir) => Either.fromNullable(dir.children))
    .map(reduce(sizeReducer(size), size))
    .fold(
      () => 0,
      (size) => size,
    )

// TODO: Get available space of the user from the backend
export default function UsedSpace() {
  const drive = useDrive()
  const { t } = useTranslation("editor")

  const [usedPercent, setUsedPercent] = useState(0)
  const [usedMb, setUsedMb] = useState(0)

  useEffect(() => {
    if (!drive) return

    const totalSize = calculateTreeSize(drive.root)
    const allFilesSizeMB = totalSize / 1024 / 1024
    const usedSpacePercent = (allFilesSizeMB / drive.params.maxTotalSize) * 100

    setUsedPercent(usedSpacePercent > 100 ? 100 : usedSpacePercent)
    setUsedMb(allFilesSizeMB)
  }, [drive])

  const usedSpaceText = t("used-space")

  return Either.fromNullable(drive).fold(Null, (drive) => (
    <div className="w-full">
      <div className="flex justify-between items-center w-full">
        <div className="text-xs truncate">{usedSpaceText}</div>
        <div className="text-xs">
          {usedMb.toFixed(0)}
          {"/"}
          {drive.params.maxTotalSize}
          {"MB"}
        </div>
      </div>
      <div className="w-full bg-neutral-300 rounded-full dark:bg-neutral-700 shadow-inner">
        <div
          className={`bg-gradient-to-r h-1 rounded-full from-slate-500 to-neutral-500`}
          style={{ width: `${usedPercent.toFixed(0)}%` }}
        />
      </div>
    </div>
  ))
}

export { UsedSpace }
