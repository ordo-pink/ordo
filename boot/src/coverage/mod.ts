import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"

const denoPath = getDenoPath()
const opts = await new Command()
	.name("coverage")
	.version("0.1.0")
	.description(
		`Coverage command executes tests and collects test coverage reports. It generates a set of ` +
			`JSON files with "deno test --coverage", then creates a lcov profile. The result ` +
			`of collecting coverage reports is saved to "./var/coverage".`
	)
	.option("--no-lcov", "Disable generating LCOV report.")
	.parse(Deno.args)

await runDenoCommand(denoPath, ["test", "--coverage=./var/coverage", "--parallel", Deno.cwd()])

if (!opts.options.lcov) Deno.exit(0)

await runDenoCommand(denoPath, [
	"coverage",
	"./var/coverage",
	"--lcov",
	"--output=./var/coverage/profile.lcov",
])

console.log(
	`🎉 Done! To generate an HTML version of the report, run ` +
		`"genhtml -o var/coverage/profile/html var/coverage/profile.lcov". ` +
		`NOTE: this command requires "lcov" to be installed on your system.`
)
