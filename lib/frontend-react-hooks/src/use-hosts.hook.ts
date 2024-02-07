import { callOnce } from "@ordo-pink/tau"

let idHost: string
let dtHost: string
let staticHost: string
let websiteHost: string
let myHost: string

export type Hosts = {
	idHost: string
	dtHost: string
	staticHost: string
	websiteHost: string
	myHost: string
}
export const __initHosts = callOnce((hosts: Hosts) => {
	idHost = hosts.idHost
	dtHost = hosts.dtHost
	staticHost = hosts.staticHost
	websiteHost = hosts.websiteHost
	myHost = hosts.myHost
})

export const getHosts = () => ({ idHost, dtHost, staticHost, websiteHost, myHost })

export const useHosts = () => ({ idHost, dtHost, staticHost, websiteHost, myHost })
