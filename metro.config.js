// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// 'pretty-format' से संबंधित 'Unable to resolve' त्रुटि को ठीक करने के लिए
config.resolver.extraNodeModules = {
    // Metro को यह बताने के लिए कि .js एक्सटेंशन के बिना फ़ाइलों को कैसे ढूंढे
    // यह pretty-format v29.x और React Native 0.79/React 19 के बीच के संघर्ष को हल करता है।
    'pretty-format': require.resolve('pretty-format'), 
};

// Expo Web Bundler के लिए कभी-कभी आवश्यक होता है
config.resolver.assetExts.push('json');
config.resolver.sourceExts.push('mjs');

module.exports = config;