// src/models/flatmateListingModel.js
// 
// 💡 NOTE: यह फ़ाइल अब Node.js (CommonJS) के बजाय ES Module (import/export) का उपयोग करती है।

class FlatmateListingModel {
    constructor(data) {
        // 💡 HELPER FUNCTION: किसी भी संभावित नाम (क्लाइंट या DB) से फ़ील्ड वैल्यू प्राप्त करें
        const getFieldValue = (clientName, dbName) => data[dbName] || data[clientName];

        // ------------------------------------
        // --- Core Validation (MAPPING APPLIED) ---
        // ------------------------------------
        if (!data.location) throw new Error("Location is required for the listing.");
        
        // Price को DB ('price') या Client ('rent') से प्राप्त करें
        const rawPrice = getFieldValue('rent', 'price');
        if (!rawPrice) throw new Error("Price is required for the listing (Price/Rent field missing).");
        
        if (!data.listing_goal) throw new Error("Listing Goal is required (e.g., Rent, Sell).");
        
        // Furnishing Status को DB ('furnishing_status') या Client ('furnishing_type') से प्राप्त करें
        const rawFurnishingStatus = getFieldValue('furnishing_type', 'furnishing_status');
        if (!rawFurnishingStatus) throw new Error("Furnishing Status is required for the listing.");
        
        if (!data.deposit) throw new Error("Deposit amount is required.");

        // Price validation
        const parsedPrice = parseFloat(rawPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            throw new Error("Price must be a valid positive number.");
        }

        // Deposit validation
        const parsedDeposit = parseFloat(data.deposit);
        if (isNaN(parsedDeposit) || parsedDeposit < 0) {
            throw new Error("Deposit must be a valid number.");
        }
        
        // Image Links को DB ('imageLinks') या Client ('image_links') से प्राप्त करें
        const rawImageLinks = getFieldValue('image_links', 'imageLinks');
        const validImageLinks = Array.isArray(rawImageLinks)
            ? rawImageLinks.filter(link => typeof link === 'string' && link.trim() !== '')
            : [];
        if (validImageLinks.length < 1) { // Client-side में 1 image भी हो सकती है
            throw new Error("At least 1 valid public image link is required.");
        }

        // ------------------------------------
        // --- Assign Core Fields (MAPPED & NEW) ---
        // ------------------------------------
        this.location = data.location;
        this.price = parsedPrice; // Mapped from 'price' or 'rent'
        this.deposit = parsedDeposit; 
        this.listing_goal = data.listing_goal; 
        this.imageLinks = validImageLinks; // Mapped from 'imageLinks' or 'image_links'
        
        // Use DB's 'propertyType' or client's 'property_type'
        this.propertyType = data.propertyType || data.property_type || 'Apartment';
        
        this.description = data.description || '';
        
        // Handle bedrooms being a string like '2 BHK' (Extract number)
        let parsedBedrooms = parseInt(data.bedrooms) || 0;
        if (isNaN(parsedBedrooms) && typeof data.bedrooms === 'string') {
             const match = data.bedrooms.match(/\d+/); 
             if (match) parsedBedrooms = parseInt(match[0]);
        }
        this.bedrooms = parsedBedrooms;

        this.bathrooms = parseInt(data.bathrooms) || 0;
        this.carpetArea = parseInt(data.carpetArea) || 0;
        
        // ------------------------------------
        // --- Assign Secondary Fields (MAPPED & NEW) ---
        // ------------------------------------
        this.furnishing_status = rawFurnishingStatus; 
        this.furnishing_details = data.furnishing_details || []; 
        
        // Mapped from client's 'available_date' or DB's 'final_available_date'
        this.final_available_date = data.final_available_date || data.available_date || 'Now'; 
        this.current_occupants = parseInt(data.current_occupants) || 0; 

        // Mapped from client's 'amenities' or DB's 'selectedAmenities'
        this.selectedAmenities = Array.isArray(data.selectedAmenities || data.amenities) 
                                 ? (data.selectedAmenities || data.amenities) : []; 

        this.is_flatmate_listing = (data.listing_goal === 'Flatmate'); 
        
        // Mapped from client's 'is_brokerage_free' or DB's 'is_no_brokerage'
        this.is_no_brokerage = !!(data.is_no_brokerage || data.is_brokerage_free); 
        
        this.max_negotiable_price = parseFloat(data.max_negotiable_price) || null; 
        
        // Mapped from client's 'negotiation_margin' (string '5') or DB's 'negotiation_margin_percent'
        this.negotiation_margin_percent = parseInt(data.negotiation_margin_percent || data.negotiation_margin) || 0; 
        
        this.preferred_gender = data.preferred_gender || 'Any'; 
        this.preferred_occupation = data.preferred_occupation || ''; 
        this.preferred_work_location = data.preferred_work_location || ''; 

        // ------------------------------------
        // --- ADDED NEW GRANULAR FIELDS (Step 2, 3, 7) ---
        // ------------------------------------
        this.city = data.city || null;
        this.area = data.area || null;
        this.pincode = data.pincode || null;
        this.flat_number = data.flat_number || null;
        this.state_name = data.state_name || null;
        this.districtName = data.districtName || null;
        
        this.building_age = parseInt(data.building_age) || 0;
        this.ownership_type = data.ownership_type || null;
        this.maintenance_charges = parseFloat(data.maintenance_charges) || 0;
        this.facing = data.facing || null;
        this.parking = data.parking || null;
        this.gated_security = data.gated_security === undefined ? true : !!data.gated_security;
        this.flooring_type = Array.isArray(data.flooring_type) ? data.flooring_type : [];
        this.nearby_location = data.nearby_location || null;

        this.transit_points = Array.isArray(data.transit_points) ? data.transit_points : [];
        this.essential_points = Array.isArray(data.essential_points) ? data.essential_points : [];
        this.utility_points = Array.isArray(data.utility_points) ? data.utility_points : [];

        // ------------------------------------
        // --- System Fields (Unchanged) ---
        // ------------------------------------
        this.postedBy = data.postedBy || null; 
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || this.createdAt; 
        this.status = data.status || 'Pending Review';
        // Ensure rating is a string (as per frontend)
        this.rating = data.rating
            ? String(data.rating) 
            : (Math.floor(Math.random() * 20) / 10 + 3.0).toFixed(1).toString();
    }

    // Helper to determine BHK or Room Count based on property type
    getBhkOrRooms() {
        if (this.propertyType === 'Flat' || this.propertyType === 'Shared Flatmate' || this.propertyType.includes('BHK')) {
            // यदि bedrooms 0 है, तो इसे RK (Room Kitchen) मानें, अन्यथा BHK
            return this.bedrooms > 0 ? `${this.bedrooms} BHK` : 'RK'; 
        } else {
            return `${this.bedrooms} Bedrooms`; 
        }
    }


    toRTDBData(userId) {
        // Data structure for saving to Realtime Database
        this.postedBy = userId;
        return {
            location: this.location,
            price: this.price, 
            deposit: this.deposit, 
            listing_goal: this.listing_goal,
            imageLinks: this.imageLinks, 
            description: this.description,
            bedrooms: this.bedrooms,
            bathrooms: this.bathrooms,
            propertyType: this.propertyType,
            carpetArea: this.carpetArea, 
            
            furnishing_status: this.furnishing_status, 
            final_available_date: this.final_available_date,
            current_occupants: this.current_occupants,
            selectedAmenities: this.selectedAmenities,
            is_flatmate_listing: this.is_flatmate_listing,
            is_no_brokerage: this.is_no_brokerage,
            max_negotiable_price: this.max_negotiable_price,
            negotiation_margin_percent: this.negotiation_margin_percent,
            preferred_gender: this.preferred_gender,
            preferred_occupation: this.preferred_occupation,
            preferred_work_location: this.preferred_work_location,
            
            // Granular Location & Property Details
            city: this.city,
            area: this.area,
            pincode: this.pincode,
            flat_number: this.flat_number,
            state_name: this.state_name,
            districtName: this.districtName,
            building_age: this.building_age,
            ownership_type: this.ownership_type,
            maintenance_charges: this.maintenance_charges,
            facing: this.facing,
            parking: this.parking,
            gated_security: this.gated_security,
            flooring_type: this.flooring_type,
            nearby_location: this.nearby_location,

            // Proximity POI
            transit_points: this.transit_points,
            essential_points: this.essential_points,
            utility_points: this.utility_points,
            
            // System Fields
            postedBy: this.postedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            status: this.status,
            rating: this.rating
        };
    }

    // Minimal data for post response
    toFrontendData(listingId) {
        return {
            listingId,
            location: this.location,
            price: this.price,
            deposit: this.deposit,
            listing_goal: this.listing_goal,
            imageLinks: this.imageLinks,
            propertyType: this.propertyType,
            is_no_brokerage: this.is_no_brokerage,
            createdAt: this.createdAt,
            status: this.status
        };
    }

    // API 1 (Limited Details) for public/user list view
    static toLimitedFrontendData(data, listingId) {
        // Static helper for bhkOrRooms (to be used in the static method above)
        const getBhkOrRoomsStatic = (data) => {
            const propertyType = data.propertyType || 'Apartment';
            
            // 🚀 FIX 1.1: bedrooms को सुरक्षित रूप से संख्या के रूप में पार्स करें
            const bedrooms = parseInt(data.bedrooms) || 0; 
            
            if (propertyType === 'Flat' || propertyType === 'Shared Flatmate' || propertyType.includes('BHK')) {
                return bedrooms > 0 ? `${bedrooms} BHK` : 'RK'; 
            } else {
                return `${bedrooms} Bedrooms`; 
            }
        }
        
        // 🚀 FIX 2: Price को toLocaleString से पहले सुरक्षित रूप से जांचें
        const safePrice = data.price || 0;
        const formattedPrice = safePrice ? safePrice.toLocaleString('en-IN') : 'N/A';
        
        // 🚀 FIX 3: 'image' फ़ील्ड को सुरक्षित रूप से हैंडल करें
        // DB में imageLinks नाम से एक Array की अपेक्षा की जाती है।
        let firstImage = null;
        if (Array.isArray(data.imageLinks) && data.imageLinks.length > 0) {
            firstImage = data.imageLinks[0];
        } else if (Array.isArray(data.image_links) && data.image_links.length > 0) {
             // Fallback/Legacy check (यदि DB में 'image_links' है)
             firstImage = data.image_links[0];
        } else if (data.imageLinks && data.imageLinks.length > 0 && typeof data.imageLinks !== 'string') {
             // 🛑 OLD CRASHING LOGIC BYPASSED: original code was 'data.imageLinks && data.imageLinks.length > 0 ? data.imageLinks[0] : null' 
             // We keep the original logic, but safely wrapped in the NEW logic above.
        }
        
        return {
            listingId: listingId,
            // Price is assumed to be raw number from DB
            // 🛑 MODIFIED: अब सुरक्षित 'formattedPrice' का उपयोग करें
            price: formattedPrice, 
            // 🛑 MODIFIED: अब सुरक्षित 'firstImage' का उपयोग करें
            image: firstImage, 
            propertyType: data.propertyType || 'N/A',
            location: data.location || 'N/A',
            rating: data.rating || 'N/A',
            bathrooms: data.bathrooms || 0,
            
            // 🚀 FIX 1.2: यह सुनिश्चित करता है कि bedrooms हमेशा एक संख्या हो
            bedrooms: parseInt(data.bedrooms) || 0, 
            
            bhkOrRooms: getBhkOrRoomsStatic(data),
            totalCarpetAreaSqft: data.carpetArea || 'N/A',
            finalAvailableDate: data.final_available_date || 'Now',
            listingGoal: data.listing_goal || 'N/A',
            isNoBrokerage: data.is_no_brokerage || false,
            status: data.status || 'N/A', 
            createdAt: data.createdAt
        };
    }

    // API 2 & 4 (Complete Details) for single view/update response
    toFrontendFullData(listingId) {
        return {
            listingId,
            location: this.location,
            price: this.price,
            deposit: this.deposit,
            listingGoal: this.listing_goal,
            description: this.description,
            imageLinks: this.imageLinks, 
            
            propertyDetails: {
                propertyType: this.propertyType,
                bedrooms: this.bedrooms,
                bathrooms: this.bathrooms,
                bhkOrRooms: this.getBhkOrRooms(),
                totalCarpetAreaSqft: this.carpetArea || 'N/A',
                furnishingStatus: this.furnishing_status,
                furnishingDetails: this.furnishing_details,
                selectedAmenities: this.selectedAmenities,
                
                buildingAge: this.building_age,
                ownershipType: this.ownership_type,
                maintenanceCharges: this.maintenance_charges,
                facing: this.facing,
                parking: this.parking,
                gatedSecurity: this.gated_security,
                flooringType: this.flooring_type,
                nearbyLocation: this.nearby_location,
            },
            
            financials: {
                isNoBrokerage: this.is_no_brokerage,
                maxNegotiablePrice: this.max_negotiable_price,
                negotiationMarginPercent: this.negotiation_margin_percent,
            },
            
            availability: {
                finalAvailableDate: this.final_available_date,
                currentOccupants: this.current_occupants,
            },

            preferences: {
                preferredGender: this.preferred_gender,
                preferredOccupation: this.preferred_occupation,
                preferredWorkLocation: this.preferred_work_location,
            },
            
            addressDetails: {
                city: this.city,
                area: this.area,
                pincode: this.pincode,
                flatNumber: this.flat_number,
                stateName: this.state_name,
                districtName: this.districtName,
            },
            
            proximityPoints: {
                transitPoints: this.transit_points,
                essentialPoints: this.essential_points,
                utilityPoints: this.utility_points,
            },

            systemInfo: {
                postedBy: this.postedBy,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
                status: this.status,
                rating: this.rating
            }
        };
    }
}

// ES Module export
export { FlatmateListingModel };