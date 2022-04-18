<<<<<<< HEAD
<<<<<<< HEAD
=======
const { resolve } = require("path");

>>>>>>> ordo/main
=======
const { resolve } = require("path");

>>>>>>> ordo-app/main
module.exports = {
	/**
	 * This is the main entry point for your application, it's the first file
	 * that runs in the main process.
	 */
<<<<<<< HEAD
<<<<<<< HEAD
	entry: "./src/main.ts",
=======
	entry: "./src/index.ts",
>>>>>>> ordo/main
=======
	entry: "./src/index.ts",
>>>>>>> ordo-app/main
	// Put your normal webpack config below here
	module: {
		rules: require("./webpack.rules"),
	},
	resolve: {
<<<<<<< HEAD
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
<<<<<<< HEAD
=======
=======
>>>>>>> ordo-app/main
		alias: {
			"@core": resolve("./src/core"),
			"@containers": resolve("./src/containers"),
			"@modules": resolve("./src/modules"),
<<<<<<< HEAD
		},
>>>>>>> ordo/main
=======
			"@utils": resolve("./src/utils"),
			"@components": resolve("./src/components"),
		},
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
>>>>>>> ordo-app/main
	},
};
