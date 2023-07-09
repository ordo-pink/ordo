import { CLIOption } from "./types.ts"

export const CLIBErrorString = {
	missingRequiredLongOptionInput: (arg: string) =>
		`Option ${arg} requires a value. Try "${arg}=VALUE" or "${arg} VALUE".`,
	missingArgument: (name: string) => `Missing required argument "${name}".`,
	invalidOptionValueProvided: (provided: string, expectation: CLIOption) =>
		`Option "${
			expectation.long
		}" was provided invalid value "${provided}". Expected ${Object.keys(
			expectation?.values ?? {}
		).join(" | ")}.`,
	invalidExpectations: () => "Invalid expectations",
}
