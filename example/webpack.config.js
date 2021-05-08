var Path = require('path');
var Webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  lib: Path.join(__dirname, '../dist'),
  src: Path.join(__dirname, './'),
  build: Path.join(__dirname, '../docs'),
  node_modules: Path.join(__dirname, '../node_modules')
};

const config = {
  entry: [PATHS.src],
  mode: 'production',
  output: {
    path: PATHS.build,
    publicPath: './',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.tsx']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      },
      include: [PATHS.src]
    }, {
      test: /\.tsx$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-typescript']
      },
      include: [PATHS.src]
    }],
  },
  plugins: [
    new HTMLWebpackPlugin({
      minify: false,
      filename: 'index.html',
      template: Path.join(PATHS.src, 'index.html')
    })
  ]
};

module.exports = config;
