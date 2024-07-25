import { useOrdoContext } from "./use-ordo-context.hook"

export const useHosts = () => {
	const { get_hosts } = useOrdoContext()

	return get_hosts()
}
