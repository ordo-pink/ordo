<<<<<<< HEAD
<<<<<<< HEAD
// eslint-disable-next-line
const rules = require("./webpack.rules");
// eslint-disable-next-line
=======
const { resolve } = require("path");
const rules = require("./webpack.rules");
>>>>>>> ordo/main
=======
const { resolve } = require("path");
const rules = require("./webpack.rules");
>>>>>>> ordo-app/main
const plugins = require("./webpack.plugins");

rules.push({
	test: /\.css$/,
	use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "postcss-loader" }],
});

module.exports = {
	module: {
		rules,
	},
	plugins: plugins,
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
<<<<<<< HEAD
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
>>>>>>> ordo-app/main
	},
};
