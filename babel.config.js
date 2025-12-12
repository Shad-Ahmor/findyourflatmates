// babel.config.js

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ... अन्य प्लगइन्स (जैसे reanimated)
      'react-native-reanimated/plugin', 
      
      // 🌟 FIX: react-native-dotenv कॉन्फ़िगरेशन जोड़ें/जाँचें
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env", // सुनिश्चित करें कि आपकी .env फ़ाइल रूट डायरेक्टरी में है
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }]
    ],
  };
};