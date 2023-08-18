const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const glob = require('glob');

const getEntryPoints = () => {
	const entryPoints = {};
	const files = glob.sync(path.resolve(__dirname, './src/**/*.{ts,tsx}'));
	files.forEach((file) => {
		const entryName = path.relative('./src', file).replace(/\.tsx?/, '');
		entryPoints[entryName] = file;
	});
	return entryPoints;
};

module.exports = (_, argv) => {
	const isDev = argv.mode === 'development';
	return {
		entry: getEntryPoints(),
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'lib'),
			libraryTarget: 'commonjs2',
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					loader: 'ts-loader',
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.jsx'],
		},
		externals: [nodeExternals()],
		devtool: 'source-map',
		devServer: {
			static: path.join(__dirname, 'lib'),
			compress: true,
			port: 4000,
			devMiddleware: {
				writeToDisk: true,
			},
		},
		plugins: [
			new Dotenv(),
			...(isDev
				? [
						new ESLintPlugin({
							files: ['./src'],
							extensions: ['tsx', 'ts', 'jsx', 'js'],
							overrideConfigFile: path.resolve(__dirname, '.eslintrc.js'),
						}),
				  ]
				: []),
		],
	};
};
