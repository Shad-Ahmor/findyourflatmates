// app.config.js

// .env फ़ाइल को पढ़ने के लिए dotenv लाइब्रेरी का उपयोग करें
require('dotenv').config();

export default ({ config }) => {
  return {
    ...config,
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      // अन्य .env चर यहाँ जोड़ें
      eas: {
        projectId: "your-eas-project-id"
      }
    }
  };
};