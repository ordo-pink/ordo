import { createProgress, runBunCommand0, runCommand0 } from "@ordo-pink/binutil"
import { writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

export const registerGitHooks = () =>
	Oath.empty()
		.tap(startProgress)
		.chain(() =>
			runBunCommand0(`build ./etc/git/hooks/pre-commit.ts --compile --outfile pre-commit`)
				.chain(() => runCommand0("mv -f pre-commit .git/hooks/pre-commit"))
				.tap(progress.inc)
		)
		.chain(() =>
			runBunCommand0(`build ./etc/git/hooks/commit-msg.ts --compile --outfile commit-msg`)
				.chain(() => runCommand0("mv -f commit-msg .git/hooks/commit-msg"))
				.tap(progress.inc)
		)
		.chain(() =>
			runBunCommand0(`build ./etc/git/hooks/pre-push.ts --compile --outfile pre-push`)
				.chain(() => runCommand0("mv -f pre-push .git/hooks/pre-push"))
				.tap(progress.inc)
		)
		.bimap(progress.break, progress.finish)

const progress = createProgress()
const startProgress = () => progress.start("Creating git hooks")
