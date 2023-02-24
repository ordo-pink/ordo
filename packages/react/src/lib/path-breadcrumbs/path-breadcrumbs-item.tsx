import { AiFillFolder } from "react-icons/ai"
import { BsChevronRight } from "react-icons/bs"

type Props = {
  chunk: string
}

export const PathBreadcrumbsItem = ({ chunk }: Props) => {
  return (
    <div className="flex items-center shrink-0 space-x-2 ml-4 mb-2 first-of-type:ml-0">
      <AiFillFolder />
      <div>{chunk ? chunk : "/"}</div>
      <BsChevronRight />
    </div>
  )
}
