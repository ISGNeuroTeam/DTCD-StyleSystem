const path = require('path');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/manager-webpack5',
    'storybook-dark-mode',
  ],

  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.module.rules.forEach((rule) => {
      if (rule.test && '.css'.match(rule.test)) {
        rule.exclude = path.resolve(__dirname, '../src/base-components');
      }
    });

    config.module.rules.push({
      test: /\.html$/i,
      include: path.resolve(__dirname, '../src/base-components'),
      use: ['html-loader'],
    });

    config.module.rules.push({
      test: /\.((c|sa|sc)ss)$/i,
      include: path.resolve(__dirname, '../src/base-components'),
      use: [
        {
          loader: 'css-loader',
          options: {
            exportType: 'string',
            sourceMap: false,
          }
        },
        {
          loader: 'postcss-loader',
        },
        'sass-loader'
      ],
    });

    return config;
  },
}