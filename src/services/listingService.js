// src/services/listingService.js

// 💡 Firebase Configuration से Database Service इंपोर्ट करें
import { db, auth } from '../config/firebase';
import {
  ref,
  push,
  set,
  get,
  update,
    query, // 💡 ADDED for Query Restriction
    limitToFirst, // 💡 ADDED for DOS/DDOS Protection
} from 'firebase/database';
import { FlatmateListingModel } from '../models/flatmateListingModel.js';

// 🛑 बेस RTDB पाथ
const ALL_USERS_PATH = 'flatmate/users';

/**
 * 🛑 NEW SECURITY FUNCTION: Sanitizes strings to prevent XSS and limit length.
 * @param {string} input - The string to sanitize.
 * @returns {string} The sanitized and length-limited string.
 */
const sanitizeString = (input) => {
    if (typeof input !== 'string') return input;
    // XSS Prevention: HTML/JS special characters are encoded.
    let sanitized = input.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    // Length Limit (500 chars max for general description/text fields)
    return sanitized.substring(0, 500); 
};


// ======================================================
// 🚀 1. GET ALL LISTINGS (R) - DDOS/DOS Protection applied
// ======================================================

export const getAllListingsClient = async (filters) => {
 
  // 1. RTDB से ALL USERS का डेटा फ़ेच करें
  const allUsersRef = ref(db, ALL_USERS_PATH);
  
  // 🛑 DDOS/DOS FIX: Query Restriction लागू करें
    // बिना सीमा के पूरा डेटा खींचने से बचें (इससे बिलिंग और DOS का खतरा कम होता है)।
    const limitedQuery = query(allUsersRef, limitToFirst(100));

  const snapshot = await get(limitedQuery); // limitedQuery का उपयोग करें
 
  if (!snapshot.exists()) {
    console.warn(`Users path does not exist or access denied.`);
    return [];
  }
 
  const usersData = snapshot.val() || {};
  console.log('RTDB Raw Data Fetched:', JSON.stringify(usersData, null, 2));
  let allListings = [];
 
  // 💡 DEBUG LOG: देखें कि क्या कोई डेटा फ़ेच हुआ है
  console.log(`Successfully fetched user keys: ${Object.keys(usersData).length}`);

  // --- Filter Normalization ---
  const normalizedGoal = filters.type ? String(filters.type).toLowerCase().trim() : null;
  const normalizedCity = filters.city ? String(filters.city).toLowerCase().trim() : null;
  const normalizedBhkTypes = Array.isArray(filters.bhkType)
    ? filters.bhkType.map(bhk => String(bhk).toLowerCase().trim())
    : []; // Empty Array if no filter

  // --- 2. Client-Side Scanning and Filtering ---
  for (const userId in usersData) {
    const userData = usersData[userId];
    // 🚀 FIX 1: सीधे property नोड की जाँच करें, न कि पूरे userData की
    const properties = userData.property || {};
   
    // यदि यूजर के पास लिस्टिंग नहीं है, तो अगले यूजर पर जाएँ
    if (Object.keys(properties).length === 0) {
      continue;
    }

    for (const listingId in properties) {
      const listingData = properties[listingId];
      let passesFilters = true;
     
      // 💡 DEBUG LOG: प्रत्येक लिस्टिंग को देखें
      // console.log(`Processing Listing: ${listingId} in City: ${listingData.city}`);

      // 🛑 MANDATORY STATUS CHECK (सबसे संभावित कारण)
      // यदि `status` फ़ील्ड DB में गायब है, तो `null` हमेशा continue करेगा।
      // यहाँ हम `|| 'unknown'` जोड़कर सुनिश्चित करते हैं कि यह क्रैश न हो।
      const listingStatus = (listingData.status || 'unknown').toLowerCase().trim();
      if (listingStatus !== 'approved' && listingStatus !== 'pending review') {
        continue;
      }

      // 💡 Filter by Listing Goal (Type)
      const listingGoal = (listingData.listing_goal || '').toLowerCase().trim();
      if (normalizedGoal && !listingGoal.includes(normalizedGoal)) {
        passesFilters = false;
      }

      // 💡 Filter by City
      const listingCity = (listingData.city || '').toLowerCase().trim();
      if (passesFilters && normalizedCity) {
        if (listingCity !== normalizedCity) {
          passesFilters = false;
        }
      }
     
      // 💡 Filter by BHK/Rooms
      if (passesFilters && normalizedBhkTypes.length > 0) { 
        try {
          // 🚀 FIX 2: Model call में क्रैश की संभावना कम करें
          // toLimitedFrontendData कॉल यहाँ बहुत संवेदनशील है।
          const tempBhkOrRooms = FlatmateListingModel.toLimitedFrontendData(listingData, listingId).bhkOrRooms;
          const listingBhk = tempBhkOrRooms ? tempBhkOrRooms.toLowerCase().trim() : null;
         
          if (!listingBhk || !normalizedBhkTypes.includes(listingBhk)) {
            passesFilters = false;
          }
        } catch (e) {
          // यदि मॉडल क्रैश होता है, तो लिस्टिंग को पास न करें और चेतावनी दें।
          console.warn(`Skipping listing ${listingId} due to model error:`, e.message);
          passesFilters = false;
        }
      }

      if (passesFilters) {
        try {
          const limitedData = FlatmateListingModel.toLimitedFrontendData(listingData, listingId);
          allListings.push(limitedData);
        } catch (e) {
          console.warn(`Skipping listing ${listingId} due to final formatting error:`, e.message);
        }
      }
    }
  }
 
  return allListings;
};


// ======================================================
// 🚀 2. FETCH SINGLE LISTING (R)
// ======================================================

export const fetchSingleListingClient = async (listingId, user) => {
  if (!listingId) {
    throw new Error("Listing ID is required for fetching a single listing.");
  }
 
  // 1. Authentication Check
  if (!user || !user.uid) {
    console.error("Authentication required for fetching a single listing.");
    throw new Error("Authentication error: Valid user object is missing or user is not logged in.");
  }
 
  const userId = user.uid;

  try {
    // 2. RTDB पाथ सेट करें
    // यह उपयोगकर्ता की अपनी लिस्टिंग है, इसलिए RTDB Security Rules में `auth.uid === $uid` की आवश्यकता है।
    const listingPath = `${ALL_USERS_PATH}/${userId}/property/${listingId}`;
    const listingRef = ref(db, listingPath); // RTDB संदर्भ बनाएँ

    // 3. डेटा फ़ेच करें
    const snapshot = await get(listingRef);
   
    const listingData = snapshot.val();
   
    // 4. Not Found हैंडल करें
    if (listingData === null) {
      console.warn(`[Client Service] Listing ID ${listingId} not found or does not belong to user ${userId}.`);
      throw new Error("Listing not found (404). The property either does not exist or you do not have permission to view it.");
    }
   
    // 5. पूरा डेटा ऑब्जेक्ट लौटाएँ
    return listingData;

  } catch (error) {
    console.error(`Error fetching listing ${listingId} from RTDB:`, error);
    throw new Error("Failed to load listing data for editing.");
  }
};


// ======================================================
// 🚀 3. FETCH USER OWN LISTINGS (R)
// ======================================================

export const fetchUserOwnListingProperties = async () => {
 
  // 1. Firebase Client Auth से वर्तमान उपयोगकर्ता ID प्राप्त करें
  const user = auth.currentUser;
  if (!user) {
    // यदि कोई उपयोगकर्ता लॉग इन नहीं है, तो क्लाइंट को 401 के समान प्रतिक्रिया दें
    console.error("Authentication required. No current user found.");
    throw new Error("User not authenticated.");
  }
  const userId = user.uid;
 
  try {
    // 2. उपयोगकर्ता की संपत्ति के लिए RTDB पाथ सेट करें (आपके पुराने सर्विस लॉजिक के अनुसार)
    const userPropertiesRef = ref(db, `${ALL_USERS_PATH}/${userId}/property`);
    const snapshot = await get(userPropertiesRef);
   
    const properties = snapshot.val() || {};
    const userListings = [];
   
    // 3. प्रत्येक लिस्टिंग को पार करें और Limited Frontend Data फॉर्मेट में बदलें
    for (const listingId in properties) {
      const listingData = properties[listingId];
     
      // FlatmateListingModel.toLimitedFrontendData का उपयोग करें
      const listing = FlatmateListingModel.toLimitedFrontendData(listingData, listingId);
      userListings.push(listing);
    }
   
    return userListings; // यह array of listings आपके frontend को return हो जाएगा

  } catch (error) {
    console.error(`Error fetching user ${userId}'s listings from RTDB:`, error);
    throw new Error("Failed to fetch your listings.");
  }
};


// ======================================================
// 🚀 4. CREATE LISTING (C) - XSS/Data Integrity Protection applied
// ======================================================

export const createListingClient = async (listingDetails) => {
 
  // 1. Firebase Client Auth से वर्तमान उपयोगकर्ता ID प्राप्त करें (Verify Token का काम)
  const user = auth.currentUser;
  if (!user) {
    console.error("Authentication required for creating a listing.");
    throw new Error("Authentication error: User ID missing.");
  }
  const userId = user.uid;
 
  try {
    // 2. Listing को Validate और Format करें (Model का उपयोग करके)
    // यह FlatmateListingModel client fields (जैसे 'rent') को DB fields (जैसे 'price') में बदलता है।
    const listingModel = new FlatmateListingModel(listingDetails);
    let finalListing = listingModel.toRTDBData(userId); // इसमें userId सेट हो जाता है

    // 🛑 CRITICAL FIX: Final Listing Data को साफ करें (Sanitize) - XSS/Data Integrity
        for (const key in finalListing) {
            // केवल स्ट्रिंग्स को साफ़ करें और उनकी लंबाई सीमित करें
            if (typeof finalListing[key] === 'string') {
                finalListing[key] = sanitizeString(finalListing[key]); 
            }
        }
        
    // 3. RTDB संदर्भ प्राप्त करें: /flatmate/users/{userId}/property
    const userPropertyRef = ref(db, `${ALL_USERS_PATH}/${userId}/property`);
   
    // 4. एक अद्वितीय ID (Key) जेनरेट करें और डेटा सेट करें
    const newListingRef = push(userPropertyRef); // Generates unique ID
    await set(newListingRef, finalListing);

    // 5. Frontend के लिए minimal safe data return करें
    return {
      listingId: newListingRef.key,
      data: listingModel.toFrontendData(newListingRef.key)
    };

  } catch (error) {
    // Model validation errors (e.g., "Price is required") को यहाँ पकड़ा जाएगा
    console.error("Error creating new listing:", error);
    throw error;
  }
};


// ======================================================
// 🚀 5. UPDATE LISTING (U) - XSS/Data Integrity Protection applied
// ======================================================

export const updateListingClient = async (listingId, updates) => {
 
  // 1. Firebase Client Auth से वर्तमान उपयोगकर्ता ID प्राप्त करें (Verify Token का काम)
  const user = auth.currentUser;
  if (!user) {
    console.error("Authentication required for update.");
    throw new Error("User not authenticated.");
  }
  const userId = user.uid;
 
  // 2. RTDB संदर्भ (Reference) प्राप्त करें
  const listingRef = ref(db, `${ALL_USERS_PATH}/${userId}/property/${listingId}`);
 
  // 3. स्वामित्व (Ownership) और अस्तित्व (Existence) की जांच करें
  const snapshot = await get(listingRef);
 
  if (!snapshot.exists()) {
    // यह 404 या 403 (Permission denied) के समान है क्योंकि यह उपयोगकर्ता का नहीं है या मौजूद नहीं है
    throw new Error("Listing not found or you do not have permission to modify it.");
  }
 
  // 4. Update के लिए स्वीकार्य (Allowlisted) फ़ील्ड परिभाषित करें (आपके Node.js लॉजिक से कॉपी किया गया)
  const updatableFields = [
    // Core Details
    'price', 'deposit', 'description', 'location',
    // Property Details (Step 2 & 3)
    'bedrooms', 'bathrooms', 'carpetArea',
    'city', 'area', 'pincode', 'flat_number', 'state_name', 'districtName',
    'building_age', 'ownership_type', 'maintenance_charges', 'facing', 'parking', 'gated_security',
    'flooring_type', 'nearby_location',
    // Availability & Furnishing (Step 4)
    'final_available_date',
    'current_occupants',
    'furnishing_status',
    'selectedAmenities',
    // Negotiation & Requirements (Step 5)
    'is_no_brokerage',
    'max_negotiable_price',
    'negotiation_margin_percent',
    'preferred_gender', 'preferred_occupation', 'preferred_work_location',
    // Images (Step 6)
    'imageLinks',
    // Proximity (Step 7)
    'transit_points', 'essential_points', 'utility_points',
  ];

  const allowedUpdates = {};

  // 5. इनकमिंग 'updates' को फ़िल्टर और साफ़ करें
  for (const key in updates) {
    if (updatableFields.includes(key)) {
      let value = updates[key];
     
            // 🛑 CRITICAL FIX: Sanitization लागू करें (XSS/Data Integrity)
            if (typeof value === 'string') {
                value = sanitizeString(value); // Sanitized and length-limited
            }

      // टाइप कास्टिंग (आपके Node.js लॉजिक से)
      if (key === 'price' || key === 'deposit' || key === 'maintenance_charges' || key === 'max_negotiable_price') {
        value = Number(value);
        if (isNaN(value)) value = 0;
      }
      if (key === 'bedrooms' || key === 'bathrooms' || key === 'carpetArea' || key === 'current_occupants' || key === 'building_age' || key === 'negotiation_margin_percent') {
        value = parseInt(value);
        if (isNaN(value)) value = 0;
      }
     
      allowedUpdates[key] = value;
    }
  }
 
  if (Object.keys(allowedUpdates).length === 0) {
    throw new Error("Invalid update data: No updatable fields provided.");
  }
 
  // 6. Timestamp जोड़ें
  allowedUpdates.updatedAt = new Date().toISOString();
 
  try {
    // 7. RTDB अपडेट करें
    await update(listingRef, allowedUpdates);

    // 8. अपडेटेड डेटा Fetch करें
    const updatedSnapshot = await get(listingRef);
    const updatedListingData = updatedSnapshot.val();

    // 9. मॉडल का उपयोग करके full data response फॉर्मेट करें
    const model = new FlatmateListingModel(updatedListingData);
    return model.toFrontendFullData(listingId);
   
  } catch (error) {
    console.error(`Error performing RTDB update for listing ${listingId}:`, error);
    throw new Error(`Failed to update listing: ${error.message}`);
  }
};