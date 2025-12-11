// babel.config.js (Fixed Syntax for react-native-dotenv)

module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo"],
    ],
    plugins: [
      'react-native-reanimated/plugin',
      
      // ✅ FIX: प्लगइन नाम और विकल्प एक साथ, नेस्टेड array में
      [
        "module:react-native-dotenv", // ⬅️ प्लगइन का नाम (पहला तत्व)
        {                               // ⬅️ विकल्प ऑब्जेक्ट (दूसरा तत्व)
          moduleName: "@env",
          path: ".env",
          safe: false,
          allowUndefined: true,
          verbose: false
        }
      ]
    ],
  };
};