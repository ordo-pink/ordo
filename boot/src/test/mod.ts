import { join } from "#std/path/mod.ts"
import { clib } from "#lib/clib/mod.ts"

/**
 * CLI opts for `bin/mklib`.
 */
const opts = clib(Deno.args, {
	name: "test",
	description:
		`The "test" command runs tests found deeply nested in directories ` +
		`provided as arguments. Using "bin/test ." will find and run all tests ` +
		`in the repository.`,
	args: [{ name: "name", description: "Name of the bin executable." }],
}).getOrElse(str => {
	console.log(str)
	Deno.exit()
})

// INTERNAL -------------------------------------------------------------------

// TYPES ----------------------------------------------------------------------

type TransformArgumentToAbsolutePath = (arg: string) => string

type ReduceToTestBinaryAbsolutePaths = (
	path: string
) => (acc: string[], child: Deno.DirEntry) => string[]

type CreateCommand = (testBinPath: string) => Deno.Command

type PrintCommandOutput = (output: Deno.CommandOutput) => Promise<number>

type CollectCommandOutput = (
	onEnd: PrintCommandOutput
) => (command: Deno.Command) => Promise<number>

// IMPL -----------------------------------------------------------------------

const testFiles: string[] = []

/**
 * Reducer function to create an array of "$ARG/<every_child>/bin/test" paths
 * from an array of directory children.
 */
const collectTestFiles = async (path: string) => {
	try {
		const children = Deno.readDir(path)

		for await (const child of children) {
			if (child.isDirectory) {
				await collectTestFiles(join(path, child.name))
			} else if (child.isFile && child.name.endsWith(".test.ts")) {
				testFiles.push(join(path, child.name))
			}
		}
	} catch (e) {
		console.error(e)
	}
}

// EXECUTABLE -----------------------------------------------------------------

/**
 * ./bin/test source code.
 */
const main = async (args: string[]) => {
	const paths = args.map(arg => join(Deno.cwd(), arg))
	const denoPath = join(Deno.cwd(), "opt", "deno")

	for (const path of paths) {
		await collectTestFiles(path)
	}

	for (const testFile of testFiles) {
		const command = new Deno.Command(denoPath, {
			args: ["run", "--allow-read", testFile],
			stdout: "piped",
			stderr: "piped",
		})

		try {
			const { code, stdout, stderr } = await command.output()
			code === 0 ? Deno.stdout.write(stdout) : Deno.stderr.write(stderr)
		} catch (e) {
			console.log(e)
		}
	}
}
// .map(createCommand)
// .map(collectCommandOutput(printCommandOutput))

// RUN ------------------------------------------------------------------------

await main(Deno.args)
