import { HttpError } from "@ordo-pink/rrr"

export const toUserNotFoundError = () => HttpError.NotFound("User not found")
export const toUserAlreadyExistsError = () => HttpError.Conflict("Email already taken")
export const toInvalidRequestError = () => HttpError.BadRequest("Invalid request")
export const toSameEmailError = () => HttpError.BadRequest("This is your current email")
export const toInvalidBodyError = () => HttpError.BadRequest("Invalid body")
export const toPasswordMismatchError = () => HttpError.BadRequest("Passwords do not match")
export const toEmailAlreadyConfirmedError = () => HttpError.Conflict("Email already confirmed")
