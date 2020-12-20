const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const {VueLoaderPlugin} = require('vue-loader')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const cssLoader = {
    loader: 'css-loader',
    options: {
        esModule: false
    }
}

module.exports = {
    mode: 'development',
    resolve:{
      alias: {
        styles: path.resolve(__dirname,'src', 'styles'),
        assets: path.resolve(__dirname,'assets'),
        build: path.resolve(__dirname,'build'),
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            cssLoader,
          ]
        },
        {
          test: /\.styl(us)?$/,
          use: [
            'vue-style-loader',
            cssLoader,
            {
              loader: 'stylus-loader',
              options:{
                stylusOptions: {

                }
              },
            }
          ]
        },
	      {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        },
        {
          test: /\.(png|svg|jpg|gif|jpeg)$/,
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader',
          ],
        },
      ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hegic token swap',
            filename: 'index.html',
        }),
        // new FaviconsWebpackPlugin('assets/logo.png'),
        // new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
	      new webpack.DefinePlugin({
		      __VUE_OPTIONS_API__:   JSON.stringify(true),
		      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
	      }),
    ],
    devtool:'eval',
}
