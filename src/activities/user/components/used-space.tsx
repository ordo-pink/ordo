import { IOrdoDirectory, IOrdoFile, Nullable, OrdoDirectory } from "@ordo-pink/core"
import { reduce } from "ramda"
import { useTranslation } from "react-i18next"

import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"
import { convertBytesToMb } from "$core/utils/size-format-helper"

const spaceLimitMB = Number(process.env.REACT_USER_SPACE_LIMIT || 50)

const sizeReducer = (totalSize: number) => (acc: number, item: IOrdoFile | IOrdoDirectory) =>
  OrdoDirectory.isOrdoDirectory(item) ? acc + calculateTreeSize(item, totalSize) : acc + item.size

export const calculateTreeSize = (directory: Nullable<IOrdoDirectory>, size = 0): number =>
  Either.fromNullable(directory)
    .chain((dir) => Either.fromNullable(dir.children))
    .map(reduce(sizeReducer(size), size))
    .fold(
      () => 0,
      (size) => size,
    )

const UsedSpace = () => {
  const directory = useAppSelector((state) => state.app.personalProject)

  const { t } = useTranslation()

  const usedSpaceText = t("@ordo-activity-user/used-space")

  const allFilesSizeMB = convertBytesToMb(calculateTreeSize(directory, 0))

  const usedSpacePercent = (allFilesSizeMB / spaceLimitMB) * 100

  return (
    <>
      <div className="flex justify-between mb-1 items-center">
        <div className="text-base truncate">{usedSpaceText}</div>
        <div className="text-sm font-medium">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          {allFilesSizeMB}/{spaceLimitMB}MB
        </div>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2.5 dark:bg-neutral-700 mb-3">
        <div
          className="bg-gradient-to-tr from-pink-300 dark:from-pink-700 via-rose-300 dark:via-rose-700 to-purple-300 dark:to-purple-700 h-2.5 rounded-full"
          style={{ width: `${usedSpacePercent.toFixed(0)}%` }}
        />
      </div>
    </>
  )
}

export { UsedSpace }
