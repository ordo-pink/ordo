/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@ordo-pink/oath", "@ordo-pink/switch"],
	ignoreBuildErrors: true,
}

module.exports = nextConfig
