export const obfuscate_email: User.ObfuscateEmail = email => {
	const [local, domain] = email.split("@")

	const top_level_domain_start_index = domain.lastIndexOf(".")

	const higher_level_domains = domain.slice(0, top_level_domain_start_index)
	const top_level_domain = domain.slice(top_level_domain_start_index)

	const local_trim_size = local.length > 5 ? 4 : local.length > 2 ? 2 : 0
	const domain_trim_size = higher_level_domains.length > 5 ? 4 : higher_level_domains.length > 2 ? 2 : 0

	return local
		.slice(0, local_trim_size / 2)
		.concat("*".repeat(local.length - local_trim_size))
		.concat(local_trim_size ? local.slice(-local_trim_size / 2) : "")
		.concat("@")
		.concat(higher_level_domains.slice(0, domain_trim_size / 2))
		.concat("*".repeat(higher_level_domains.length - domain_trim_size))
		.concat(domain_trim_size ? higher_level_domains.slice(-domain_trim_size / 2) : "")
		.concat(top_level_domain)
}
