import { BackendAuth } from "../../backend-au.types"

export type ObfuscateEmail = (email: BackendAuth.Email) => string

export const obfuscate_email: ObfuscateEmail = email => {
	const [localPart, domainPart] = email.split("@")

	const topLevelDomainStartIndex = domainPart.lastIndexOf(".")

	const higherLevelDomain = domainPart.slice(0, topLevelDomainStartIndex)
	const topLevelDomain = domainPart.slice(topLevelDomainStartIndex)

	const localTrimSize = localPart.length > 5 ? 4 : localPart.length > 2 ? 2 : 0
	const domainTrimSize = higherLevelDomain.length > 5 ? 4 : higherLevelDomain.length > 2 ? 2 : 0

	return localPart
		.slice(0, localTrimSize / 2)
		.concat("*".repeat(localPart.length - localTrimSize))
		.concat(localTrimSize ? localPart.slice(-localTrimSize / 2) : "")
		.concat("@")
		.concat(higherLevelDomain.slice(0, domainTrimSize / 2))
		.concat("*".repeat(higherLevelDomain.length - domainTrimSize))
		.concat(domainTrimSize ? higherLevelDomain.slice(-domainTrimSize / 2) : "")
		.concat(topLevelDomain)
}
