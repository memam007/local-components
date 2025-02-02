const sharedRules = require('../webpack/shared-rules');
const webpack = require('webpack');
const path = require('path');

module.exports = {
	core: {
		builder: 'webpack5',
	},
	"stories": [
		"../src/**/*.stories.mdx",
	],
	"addons": [
		{
			name: '@storybook/addon-essentials',
			options: {
				viewport: false,
				backgrounds: false,
				actions: false,
				controls: false,
			}
		}
	],
	webpackFinal: (config) => {
		const fileLoaderRule = config.module.rules.find(rule => rule.test.test && rule.test.test('.svg'));
		fileLoaderRule.exclude = /\.svg$/;


		config.module.rules.unshift(sharedRules.sass({
			loader: 'style-loader'
		}));

		config.module.rules.unshift(sharedRules.reactSvg);
		config.module.rules.unshift(sharedRules.cssSvg);

		config.plugins.push(
			new webpack.NormalModuleReplacementPlugin(/electron/, function (resource) {
				resource.request = path.resolve(__dirname, '../src', '__mocks__', 'electron.js');
			})
		);

		config.resolve.fallback = { ...config.resolve.fallback, os: require.resolve('os-browserify/browser') };

		return config;
	},
	babel: async (options) => ({
		...options,
		'plugins': [
			["@babel/plugin-proposal-decorators", { "legacy": true }],
			["@babel/plugin-proposal-class-properties", { "loose": true }],
		]
	}),
};
