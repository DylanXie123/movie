const rules = require('./webpack.rules');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const sveltePreprocess = require("svelte-preprocess");

rules.push(
  {
    test: /\.(s[ac]ss|css)$/i,
    use: [
      "style-loader",
      "css-loader",
      "sass-loader",
    ],
  },
  {
    test: /\.svelte$/,
    use: {
      loader: 'svelte-loader',
      options: {
        preprocess: sveltePreprocess(),
      }
    },
  },
);

module.exports = {
  // Put your normal webpack config below here
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
    new Dotenv()
  ],
};
