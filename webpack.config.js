var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');

// var process = require('process');

var config = `./config/${process.env.NODE_ENV || 'dev'}.js`;
var env = require(config);
console.log(env);
module.exports = {
	// Specify logical root of the sourcecode
	plugins: [
		new webpack.DefinePlugin({
			API_CONFIG: env
		}),
		new WebpackNotifierPlugin({alwaysNotify: true})
	],
	context: path.join(__dirname, '/src'),
	entry: {
    app: ['bootstrap.js'],
  },
	devtool: 'source-map',
	// Specify where to put the results
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js'
	},

	// Specify logical root of package imports so as to avoid relative path everywhere
	resolve: {
		root: path.join(__dirname, '/src'),
		// What files we want to be able to import
		extensions: ['', '.webpack.js', '.web.js', '.js', '.css', '.less', '.scss']
	},

	module: {
		preLoaders: [
			// Lint all js before compiling
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader'
			}
		],
		loaders: [
			{
				test: /\.js$/,
				query: {
					presets: ['es2015']
				},
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.tpl\.html$/,
				exclude: /node_modules/,
				loader: 'ngtemplate?relativeTo=/src/!html'
			},
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      }
		]
	},

	// Dev server settings
	devServer: {
		contentBase: path.join(__dirname, '/src'),
		noInfo: false,
		hot: true,
		historyApiFallback: true,
	},


	// ESLint config
	eslint: {
		configFile: path.join(__dirname, '.eslintrc')
	}
};
