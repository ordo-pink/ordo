Bun.serve({
	fetch: req => {
		const { pathname } = new URL(req.url)

		return new Response(Bun.file(pathname === "/" ? "./index.html" : `./${pathname}`))
	},
	port: 2222,
})
