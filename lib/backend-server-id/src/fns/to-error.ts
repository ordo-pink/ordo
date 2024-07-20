import { HttpError } from "@ordo-pink/rrr"

export const to_user_not_found_error = () => HttpError.NotFound("User not found")
export const to_user_already_exists_error = () => HttpError.Conflict("Email already taken")
export const to_invalid_request_error = () => HttpError.BadRequest("Invalid request")
export const to_same_email_error = () => HttpError.BadRequest("This is your current email")
export const to_invalid_body_error = () => HttpError.BadRequest("Invalid body")
export const to_password_mismatch_error = () => HttpError.BadRequest("Passwords do not match")
export const to_email_already_confirmed_error = () => HttpError.Conflict("Email already confirmed")
