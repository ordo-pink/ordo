import { runCommand0 } from "@ordo-pink/binutil"

runCommand0("bin/precommit", { stderr: "inherit", stdout: "inherit" }).toPromise()
