import { createProgress, runCommand0 } from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"

export const registerGitHooks = () =>
	Oath.empty()
		.tap(startProgress)
		.chain(() =>
			runCommand0(`cp ./etc/git/hooks/pre-commit.sh .git/hooks/pre-commit`)
				.chain(() => runCommand0("chmod u+x .git/hooks/pre-commit"))
				.tap(progress.inc)
		)
		.chain(() =>
			runCommand0(`cp ./etc/git/hooks/commit-msg.sh .git/hooks/commit-msg`)
				.chain(() => runCommand0("chmod u+x .git/hooks/commit-msg"))
				.tap(progress.inc)
		)
		.chain(() =>
			runCommand0(`cp ./etc/git/hooks/pre-push.sh .git/hooks/pre-push`)
				.chain(() => runCommand0("chmod u+x .git/hooks/pre-push"))
				.tap(progress.inc)
		)
		.bimap(progress.break, progress.finish)

const progress = createProgress()
const startProgress = () => progress.start("Creating git hooks")
