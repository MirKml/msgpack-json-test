const path = require('path');

module.exports = {
    entry: "./src/app.ts",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, 'public')
    },
    resolve: {
      // these type of files are considered as modules for import
      extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
      rules: [
        // .ts, .tsx
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        }
      ]
    },
    devtool: 'cheap-module-eval-source-map',
    watchOptions: {
      ignored: /node_modules/
    }
};