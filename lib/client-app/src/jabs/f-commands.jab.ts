import type { Maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const f_commands: (
	f$: Zags.Instance<OrdoClient.F.State>,
	content_repository: OrdoClient.Content.Repository,
) => Maoka.Jab =
	($, content_repository) =>
	({ use }) => {
		const state = use(ordo_client_maoka.context.consume)
		const installed_fs = {} as Record<Ordo.F.Instance, Awaited<ReturnType<OrdoClient.F.Instance>> | null>

		const handle_onmount = async () => {
			const initial_fs = await content_repository
				.read(null, F_FILE_ID)
				.pipe(oath.ops.chain(oath.from_nullable))
				.pipe(oath.ops.chain(b => oath.from_promise<OrdoClient.F.State, never>(() => new Response(b).json().catch(() => null))))
				.pipe(oath.ops.rtap(rrr => rrr && state.hunter.shoot("@ordo/main.notification.rrr", rrr)))
				.cata(oath.catas.or_else(() => null))

			if (!initial_fs) state.hunter.shoot("@ordo/main.f.enable", { f: "@ordo-f/filet:v1.0.0" })
			else for (const f of initial_fs.fs.enabled) state.hunter.shoot("@ordo/main.f.enable", { f })

			return $.marry((s, is_update) => {
				is_update &&
					void content_repository.write(null, F_FILE_ID, new Blob([JSON.stringify(s)])).cata(oath.catas.or_else(() => null))
			})
		}

		const handle_enable: OrdoClient.Command.GunFor<"@ordo/main.f.enable"> = async ({ f }) => {
			console.log(f, installed_fs[f])
			if (installed_fs[f]) return

			const uninstall = await import(f.split(":v")[0].replace("@ordo-f", "../../../../mnt/ordo").concat("/index.ts"))
				.then(module => module.default)
				.then(creator => creator(state) as ReturnType<OrdoClient.F.Instance>)
				.catch(e => {
					state.hunter.shoot("@ordo/main.notification.rrr", ordo.rrr.eio(ORDO.RRR.REASON.F_INSTALLATION_FAILED, e))
					return null
				})

			installed_fs[f] = uninstall

			const owned_fs = $.select("fs.owned")
			owned_fs.some(owned_f => f.startsWith(owned_f))
				? $.update("fs.enabled", fs => [...fs, f])
				: $.update("fs", fs => ({ enabled: [...fs.enabled, f], owned: [...fs.owned, f] }))
		}

		const handle_disable: OrdoClient.Command.GunFor<"@ordo/main.f.disable"> = async ({ f }) => {
			const enabled = $.select("fs.enabled")

			if (enabled.includes(f)) return

			await installed_fs[f]?.()

			$.update("fs.enabled", fs => fs.filter(prev_f => prev_f !== f))
		}

		use(ordo_client_maoka.jabs.handle_command("@ordo/main.f.enable", handle_enable))
		use(ordo_client_maoka.jabs.handle_command("@ordo/main.f.disable", handle_disable))
		use(maoka_dom.jabs.onmount(handle_onmount))
	}

// --- Internal ---

const F_FILE_ID = "00000000-0000-4000-8000-00000000000f"
