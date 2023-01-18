const dotenv = require('dotenv').config()
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/image/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(mp3|wav)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/audio/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/font/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
      'process.env': JSON.stringify(dotenv.parsed),
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
