const { CracoAliasPlugin } = require("react-app-alias-ex")

module.exports = {
	plugins: [{ plugin: CracoAliasPlugin, options: {} }],
	webpack: {
		configure: webpackConfig => {
			const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
				({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
			)

			webpackConfig.resolve.plugins.splice(scopePluginIndex, 1)
			return webpackConfig
		},
	},
}
