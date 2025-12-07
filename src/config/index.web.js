// src/config/index.web.js
// Web/Browser environments process.env.REACT_APP_... का उपयोग करते हैं
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default {
    API_BASE_URL,
};