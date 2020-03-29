const
  path = require( 'path' )
  // ,webpack = require( 'webpack' )
;
module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',

  // メインとなるJavaScriptファイル（エントリーポイント）
  // entry: path.resolve( `${process.cwd()}/src/js/common_body.bundle.js` ),
  // ファイルの出力設定
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
        // 拡張子 .js の場合
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Babel を利用する
            loader: 'babel-loader',
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2020 を ES5 に変換
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
