export const create_confirmation_url = (
	website_host: string,
	email: User.User["email"],
	email_code: User.InternalUser["email_code"],
): Routes.ID.ConfirmEmail.Url =>
	`${website_host}/account/confirm-email?email=${email}&code=${email_code}`
