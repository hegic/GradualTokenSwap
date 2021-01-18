const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const {VueLoaderPlugin} = require('vue-loader')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const contracts = process.env.CONTRACTS_PATH || path.resolve(__dirname, 'contracts.json')

const cssLoader = {
    loader: 'css-loader',
    options: {
        esModule: false
    }
}

module.exports = {
    mode: process.env.WEBPACK_DEV_SERVER ? "development" : "production",
    resolve:{
      alias: {
        contracts,
        utils: path.resolve(__dirname,'front', 'utils'),
        styles: path.resolve(__dirname,'front', 'styles'),
        assets: path.resolve(__dirname, 'assets'),
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
              options:{ stylusOptions: {} },
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
            {
              loader: 'file-loader',
              options: {
                // name: "[name].[ext]",
                outputPath: "assets/img",
                // useRelativePath: true,
              }
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                // name: "[name].[ext]",
                outputPath: "assets/fonts",
                // useRelativePath: true,
              }
            },
          ],
        },
      ]
    },
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    entry: {
        gradualTokenSwap: path.resolve(__dirname, './front/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'scripts/[name].bundle.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Hegic Token Swap',
            filename: 'index.html',
        }),
        new FaviconsWebpackPlugin( 'assets/logo.png'),
        new VueLoaderPlugin(),
	      new webpack.DefinePlugin({
		      __VUE_OPTIONS_API__:   JSON.stringify(true),
		      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
	      }),
    ],
    devtool:'eval',
}
