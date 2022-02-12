const rules = require('./webpack.rules');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const sveltePreprocess = require("svelte-preprocess");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

rules.push(
  {
    test: /\.(s[ac]ss|css)$/i,
    use: [
      MiniCssExtractPlugin.loader,
      { loader: "css-loader", options: { sourceMap: true }, },
      "sass-loader",
    ],
  },
  {
    test: /\.svelte$/,
    use: {
      loader: 'svelte-loader',
      options: {
        preprocess: sveltePreprocess({
          typescript: {
            tsconfigDirectory: './'
          },
          scss: {
            renderSync: true,
          }
        }),
        emitCss: true,
        onwarn: (warning, handler) => {
          const { code } = warning;
          if (code === "css-unused-selector")
            return;

          handler(warning);
        },
      }
    },
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  }
);

module.exports = {
  // Put your normal webpack config below here
  devtool: 'inline-source-map',
  module: {
    rules,
  },
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve('svelte/package.json'))
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    fallback: {
      path: require.resolve('path-browserify'),
    }
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin(),
  ],
};
