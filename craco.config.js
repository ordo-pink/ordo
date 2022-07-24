const { resolve } = require("path");

module.exports = {
	webpack: {
		alias: {
			"@i18n": resolve(__dirname, "src", "i18n"),
		},
	},
};
