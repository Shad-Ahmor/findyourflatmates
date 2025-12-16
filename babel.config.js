// babel.config.js

module.exports = function (api) {
  api.cache(true);

  const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 🚨 Must be first for Reanimated
      'react-native-reanimated/plugin',

      // 🌟 Environment variables
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],

      // =======================================================
      // 🛑 PRODUCTION ONLY HARDENING
      // =======================================================
      ...(isProd
        ? [
            // 🧹 Remove console logs (except errors)
            [
              'babel-plugin-transform-remove-console',
              { exclude: ['error'] },
            ],

            // 🔐 Obfuscation (Native builds safe)
            [
              'babel-plugin-obfuscator',
              {
                compact: true,
                simplify: true,
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                // debugProtection: true, // ❌ avoid in Expo
              },
            ],
          ]
        : []),
    ],
  };
};
