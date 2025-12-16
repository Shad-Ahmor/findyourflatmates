// babel.config.js
module.exports = function (api) {
  api.cache(true);

  const isWeb =
    process.env.PLATFORM === 'web' || process.env.BABEL_ENV === 'web';
  const isProd = process.env.APP_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // MUST be first
      'react-native-reanimated/plugin',

      // ENV support
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true,
        },
      ],

      // PROD ONLY – remove console logs
      ...(isProd
        ? [
            [
              'babel-plugin-transform-remove-console',
              {
                exclude: ['error', 'warn'],
              },
            ],
          ]
        : []),
    ],
  };
};
