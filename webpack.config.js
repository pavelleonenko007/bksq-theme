const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// const copyPlugin = defaultConfig.plugins.find(
// 	(plugin) => plugin instanceof CopyWebpackPlugin
// );
// copyPlugin.patterns.push({
// 	from: path.resolve(__dirname, 'src', 'assets', 'images'),
// 	to: path.resolve(__dirname, 'build', 'assets', 'images'),
// });

module.exports = (env) => {
	return {
		...defaultConfig,
		entry: {
			bundle: path.resolve(__dirname, 'src', 'index.js'),
		},
		output: {
			filename: 'js/[name].js',
			path: path.resolve(__dirname, 'build'),
			clean: true,
		},
		externalsType: 'script',
		externals: {
			ymaps3: [
				'https://api-maps.yandex.ru/v3/?apikey=4edbd054-8d5b-4022-81d1-3808d3f13102&lang=ru_RU',
				'ymaps3',
			],
		},
		plugins: [
			...defaultConfig.plugins.filter(
				(plugin) =>
					!(plugin instanceof MiniCssExtractPlugin) &&
					!(plugin instanceof DependencyExtractionWebpackPlugin)
			),
			new MiniCssExtractPlugin({
				filename: 'css/[name].css',
			}),
			new DependencyExtractionWebpackPlugin({
				outputFilename: './bundle.asset.php',
			}),
		],
		module: {
			rules: [...defaultConfig.module.rules],
		},
	};
};
