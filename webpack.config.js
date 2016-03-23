var path = require('path');
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var autoprefixer = require('autoprefixer');

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
		extensions: ['', '.webpack.js', '.web.js', '.js', '.css', '.less', '.scss'],
		alias: {
	      'foundation-apps': path.join(__dirname, '/node_modules/foundation-apps/dist/js/foundation-apps.js'),
	      'foundation-tpls': path.join(__dirname, '/node_modules/foundation-apps/dist/js/foundation-apps-templates.js'),
	    }
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
        exclude: /node_modules/,
        loaders: ['style', 'css', 'postcss', 'sass']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'postcss']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?name=/assets/img/[name].[ext]',
            'image-webpack?optimizationLevel=2&interlaced=false&progressive=true'
        ]
      }
		]
	},

  // PostCSS config (currently only for autoprefixer)
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

	// ESLint config
	eslint: {
		configFile: path.join(__dirname, '.eslintrc')
	},

	// Dev server settings
	devServer: {
		contentBase: path.join(__dirname, '/src'),
		noInfo: false,
		hot: true,
		historyApiFallback: true,
	}

};
