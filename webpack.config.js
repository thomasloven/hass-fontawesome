const path = require('path');

const common = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.svg$/i,
        use: 'raw-loader'
      },
    ],
  },
}

module.exports = [
  {
    entry: './js/fab.js',
    output: {
      filename: 'custom_components/fontawesome/data/fab.js',
      path: path.resolve(__dirname)
    },
    ...common,
  },
  {
    entry: './js/far.js',
    output: {
      filename: 'custom_components/fontawesome/data/far.js',
      path: path.resolve(__dirname)
    },
    ...common,
  },
  {
    entry: './js/fas.js',
    output: {
      filename: 'custom_components/fontawesome/data/fas.js',
      path: path.resolve(__dirname)
    },
    ...common,
  },
];
