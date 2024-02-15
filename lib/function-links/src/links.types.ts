declare global {
	module cmd {
		module links {
			type goToLinks = { name: "links.go-to-links" }
			type showLabelLinks = { name: "links.show-label-links"; payload: string }
		}
	}
}

export {}
