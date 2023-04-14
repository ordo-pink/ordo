import { ExceptionResponse } from "@ordo-pink/common-types"
import { RequestHandler } from "express"
import { FsRequestHandler, Params } from "../../../types"
import { USER_ID_PARAM } from "../../constants"

export const compareTokensStrict: RequestHandler<Params> = (req, res, next) => {
  const userId = req.params[USER_ID_PARAM]

  if (req.params.tokenParsed.sub !== userId) {
    req.params.logger.info(
      `Attempted to access other user's internal data: ${userId}, ${req.params.tokenParsed.sub}`,
    )

    return void res.status(ExceptionResponse.FORBIDDEN).send("{}")
  }

  return next()
}

export const compareTokens: FsRequestHandler = () => async (req, res, next) => {
  const userId = req.params[USER_ID_PARAM]

  if (req.params.tokenParsed.sub !== userId) {
    // const stream = await getFileContent(`/${req.params[USER_ID_PARAM]}${SystemFiles.PERMISSIONS}`)

    // const content = await new Promise<string>((resolve, reject) => {
    //   const data: Buffer[] = []

    //   stream
    //     .on("data", (chunk) => data.push(chunk))
    //     .on("end", () => resolve(Buffer.concat(data).toString("utf8")))
    //     .on("error", reject)
    // })

    // const payload = decode(content, { complete: true })?.payload as JwtPayload

    // if (!payload || !payload.data || !payload.data.includes(userId)) {
    req.params.logger.warn("Attempted to access other user's internal data", {
      currentUser: req.params.tokenParsed.sub,
      requestedUser: userId,
    })

    return void res.status(ExceptionResponse.FORBIDDEN).send("{}")
    // }
  }

  return next()
}
