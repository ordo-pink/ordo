import { AiFillFolder } from "react-icons/ai"
import { BsChevronRight } from "react-icons/bs"

type Props = {
  chunk: string
}

export default function PathBreadcrumbsItem({ chunk }: Props) {
  return (
    <div className="path-breadcrumbs-item">
      <AiFillFolder />
      <div>{chunk ? chunk : "/"}</div>
      <BsChevronRight />
    </div>
  )
}
