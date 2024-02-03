/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@ordo-pink/oath", "@ordo-pink/switch"],
	output: "export",
	skipTrailingSlashRedirect: true,
	distDir: "../../var/out/website"
}

module.exports = nextConfig
