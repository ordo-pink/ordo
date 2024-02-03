/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@ordo-pink/oath", "@ordo-pink/switch"],
	// output: "export",
	// skipTrailingSlashRedirect: true,
	// TODO: Set distDir via env to avoid breaking `bin/run`
	// distDir: "../../var/out/website"
}

module.exports = nextConfig
