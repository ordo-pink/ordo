import path from 'path';

module.exports = {
	webpack: {
		alias: {
			"@i18n": path.resolve(__dirname, "src", "i18n"),
		},
	},
};
