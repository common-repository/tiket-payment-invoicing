const path = require('path')

module.exports = (env, argv) => {
	let production = argv.mode === 'production'

	return {
		entry: {
			'js/eventtimeseditor': path.resolve(__dirname, 'app/eventtimeseditor.js'),
			'js/profile': path.resolve(__dirname, 'app/profile.js'),
			'js/purchases': path.resolve(__dirname, 'app/purchases.js'),
			'js/teams': path.resolve(__dirname, 'app/teams.js'),
			'js/eventseditor': path.resolve(__dirname, 'app/eventseditor.js'),
			'js/productseditor': path.resolve(__dirname, 'app/productseditor.js'),
			'js/translationseditor': path.resolve(
				__dirname,
				'app/translationseditor.js'
			),
			'js/payeeseditor': path.resolve(__dirname, 'app/payeeseditor.js'),
			'js/formseditor': path.resolve(__dirname, 'app/formseditor.js'),
			'js/passeseditor': path.resolve(__dirname, 'app/passeseditor.js'),
			'js/shortcode11': path.resolve(__dirname, 'app/shortcode11.js'),
			'js/shortcode12': path.resolve(__dirname, 'app/shortcode12.js'),
			'js/shortcode13': path.resolve(__dirname, 'app/shortcode13.js'),
			'js/shortcode14': path.resolve(__dirname, 'app/shortcode14.js'),
			'js/shortcode16': path.resolve(__dirname, 'app/shortcode16.js'),
			'js/shortcode17': path.resolve(__dirname, 'app/shortcode17.js'),
			'js/shortcode21': path.resolve(__dirname, 'app/shortcode21.js'),
			'js/shortcode22': path.resolve(__dirname, 'app/shortcode22.js'),
			'js/shortcode23': path.resolve(__dirname, 'app/shortcode23.js'),
			'js/shortcode24': path.resolve(__dirname, 'app/shortcode24.js'),
			'js/shortcode25': path.resolve(__dirname, 'app/shortcode25.js'),
			'js/shortcode26': path.resolve(__dirname, 'app/shortcode26.js'),
		},

		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'assets'),
		},

		devtool: production ? 'source-map' : 'source-map',

		resolve: {
			extensions: ['.js', '.jsx', '.json', '.css', '.ts', '.tsx', '.scss'],
			fallback: {
				crypto: false,
				'crypto-browserify': require.resolve('crypto-browserify'),
			},
		},

		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: ['babel-loader', 'ts-loader'],
					exclude: /node_modules/,
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/i,
					use: [
						{ loader: 'style-loader' },
						{
							loader: 'css-loader',
							options: {
								modules: true,
							},
						},
					],
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						// Creates `style` nodes from JS strings
						'style-loader',
						// Translates CSS into CommonJS
						'css-loader',
						// Compiles Sass to CSS
						'sass-loader',
					],
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
					},
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader',
				},
			],
		},
	}
}
