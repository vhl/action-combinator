/**
 * Pipes the JS through a simple Webpack build.  This is to illustrate that
 * Webpack doesn't actually have to be responsible for evaluating JS docs, but
 * it CAN be.
 */

const path = require('path');

// The exported object can be the result of a function.  This allows the code
// to set properties conditionally based on the paremeters that were passed when
// the command was run.
module.exports = (env, argv) => {
  const outputFileName =
      argv.mode === 'production' ? 'app.bundle.js' : 'app.bundle.dev.js';

  // You can debug a webpack config by using console.log() commands.  Casting
  // the resulting config to a constant before returning it lets us look at the
  // final output before the script finishes.
  const config = {
    entry: './src/index.js',
    output: {
      filename: outputFileName,
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.js'],
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: 'defaults',
              }],
            ],
          },
        },
      ],
    },
  };

  return config;
};

