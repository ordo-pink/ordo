const { resolve } = require("path");
const rules = require("./webpack.rules");
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
		alias: {
			"@core": resolve("./src/core"),
			"@containers": resolve("./src/containers"),
			"@components": resolve("./src/components"),
			"@init": resolve("./src/init"),
			"@modules": resolve("./src/modules"),
		},
	},
};
