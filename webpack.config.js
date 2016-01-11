var path = require('path');

module.exports = {
	// Specify logical root of the sourcecode
	context: path.join(__dirname, '/src'),
	entry: {
    app: ['bootstrap.js'],
  },
	
	// Specify where to put the results
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js'
	},
	
	// Specify logical root of package imports so as to avoid relative path everywhere
	resolve: {
		root: path.join(__dirname, '/src'),
		// What files we want to be able to import
		extensions: ['', '.js', '.css', '.less'], 
	},
	
	module: {
		preLoaders: [
			// Lint all js before compiling
			/*{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader'
			}*/
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
		hot: true
	},
	
	// ESLint config
	eslint: {
		configFile: path.join(__dirname, '.eslintrc')	
	}
};
