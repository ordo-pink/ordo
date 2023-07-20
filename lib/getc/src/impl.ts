import "#std/dotenv/load.ts"

// TODO: Merge all dotenvs in the repo into environment
export const getc = <K extends string>(variables: K[]): { [Key in K]: string } => {
	const vars = {} as { [Key in K]: string }

	for (const variable of variables) {
		const envVar = Deno.env.get(variable)

		if (!envVar) {
			throw new Error(`Missing environment variable "${variable}".`)
		}

		vars[variable] = envVar
	}

	return vars
}
