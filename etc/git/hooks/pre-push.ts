import { runCommand0 } from "@ordo-pink/binutil"

runCommand0(`bin/test`, { stderr: "inherit", stdout: "inherit" }).toPromise()
