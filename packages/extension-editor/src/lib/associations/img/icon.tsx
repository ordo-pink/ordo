import { IOrdoFile, IconSize } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { BsFileEarmarkImage } from "react-icons/bs"
import RenderImage from "./render-image"

type Props = {
  size: IconSize
  file: IOrdoFile
}

export default function Icon({ size, file }: Props) {
  return Switch.of(size)
    .case(IconSize.LARGE, () => <RenderImage file={file} />)
    .default(() => <BsFileEarmarkImage className="text-neutral-700 dark:text-neutral-300" />)
}
