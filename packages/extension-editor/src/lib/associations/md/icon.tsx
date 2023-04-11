import { IOrdoFile } from "@ordo-pink/common-types"
import { useMemo } from "react"
import { BsFileEarmark, BsFileEarmarkText } from "react-icons/bs"

type Props = {
  file: IOrdoFile
}

export default function Icon({ file }: Props) {
  const isEmpty = useMemo(() => file.size === 0, [file.path, file.size])

  return isEmpty ? <BsFileEarmark /> : <BsFileEarmarkText />
}
