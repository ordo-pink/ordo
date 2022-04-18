<<<<<<< HEAD
=======
const { resolve } = require("path");

>>>>>>> ordo/main
module.exports = {
	/**
	 * This is the main entry point for your application, it's the first file
	 * that runs in the main process.
	 */
<<<<<<< HEAD
	entry: "./src/main.ts",
=======
	entry: "./src/index.ts",
>>>>>>> ordo/main
	// Put your normal webpack config below here
	module: {
		rules: require("./webpack.rules"),
	},
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
<<<<<<< HEAD
=======
		alias: {
			"@core": resolve("./src/core"),
			"@containers": resolve("./src/containers"),
			"@modules": resolve("./src/modules"),
		},
>>>>>>> ordo/main
	},
};
