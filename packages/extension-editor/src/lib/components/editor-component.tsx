import { Nullable, OrdoFilePath } from "@ordo-pink/common-types"
import { useFsDriver, useRouteParams, useSubscription } from "@ordo-pink/react-utils"
import { useEffect, useState } from "react"
import { Subject } from "rxjs"

const currentFileContent$ = new Subject<Response>()

export default function Editor() {
  const params = useRouteParams()
  const fsDriver = useFsDriver()

  const [content, setContent] = useState<Nullable<string>>(null)

  const fileContentRes = useSubscription(currentFileContent$)

  useEffect(() => {
    if (!params || !fsDriver || !params["filePath*"]) return

    fsDriver.files
      .getContent(params["filePath*"] as OrdoFilePath)
      .then((res) => currentFileContent$.next(res))
  }, [params])

  useEffect(() => {
    if (!fileContentRes) return

    fileContentRes.clone().text().then(setContent)
  }, [fileContentRes])

  return <h1>{content}</h1>
}
