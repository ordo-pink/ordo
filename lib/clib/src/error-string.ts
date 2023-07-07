export const GetOptsErrorString = {
	missingRequiredLongOptionInput: (arg: string) =>
		`Option ${arg} requires a value. Try "${arg}=VALUE" or "${arg} VALUE".`,
	missingArgument: (name: string) => `Missing required argument "${name}".`,
	invalidExpectations: () => "Invalid expectations",
}
