const
  path = require( 'path' )
  // ,webpack = require( 'webpack' )
;
module.exports = {
  mode: 'development',
  output: {},
  devtool: 'source-map',
  resolve: {
    alias: {
      jquery_hub: path.resolve( __dirname, '../src/js/_modules/jquery_hub.js' )
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ]
            }
          }
        ]
      }
    ]
  },
  // plugins: [
  //   new webpack.ProvidePlugin( {
  //     'window.jQuery' : 'jquery',
  //   } )
  // ]
};
