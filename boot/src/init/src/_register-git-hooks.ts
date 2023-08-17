import { createProgress, runBunCommand0, runCommand0 } from "@ordo-pink/binutil"
import { writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

export const registerGitHooks = () =>
	Oath.empty()
		.tap(startProgress)
		.chain(() =>
			runBunCommand0(`build ./etc/git/hooks/pre-commit.ts --compile --outfile pre-commit`, {
				stdin: "inherit",
				stderr: "inherit",
			})
				.chain(() =>
					runCommand0("mv -f pre-commit .git/hooks/pre-commit", {
						stdin: "inherit",
						stderr: "inherit",
					})
				)
				.chain(() =>
					runCommand0("chmod a+x .git/hooks/pre-commit", { stdin: "inherit", stderr: "inherit" })
				)
				.tap(progress.inc)
		)
		.chain(() =>
			runBunCommand0(`build ./etc/git/hooks/commit-msg.ts --compile --outfile commit-msg`, {
				stdin: "inherit",
				stderr: "inherit",
			})
				.chain(() =>
					runCommand0("mv -f commit-msg .git/hooks/commit-msg", {
						stdin: "inherit",
						stderr: "inherit",
					})
				)
				.chain(() =>
					runCommand0("chmod a+x .git/hooks/commit-msg", { stdin: "inherit", stderr: "inherit" })
				)
				.tap(progress.inc)
		)
		.chain(() =>
			runBunCommand0(`build ./etc/git/hooks/pre-push.ts --compile --outfile pre-push`, {
				stdin: "inherit",
				stderr: "inherit",
			})
				.chain(() =>
					runCommand0("mv -f pre-push .git/hooks/pre-push", { stdin: "inherit", stderr: "inherit" })
				)
				.chain(() =>
					runCommand0("chmod a+x .git/hooks/pre-push", { stdin: "inherit", stderr: "inherit" })
				)
				.tap(progress.inc)
		)
		.bimap(progress.break, progress.finish)

const progress = createProgress()
const startProgress = () => progress.start("Creating git hooks")
