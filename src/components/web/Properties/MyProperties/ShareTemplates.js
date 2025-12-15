// src/utils/ShareTemplates.js

/**
 * Generates structured, professional templates for social media sharing.
 * @param {string} location - The location of the property (e.g., "Bandra, Mumbai").
 * @param {string} listingURL - The direct URL to the property listing.
 * @returns {object} An object containing 'english' and 'hindi' templates.
 */
export const getTemplates = (location, listingURL) => ({
    // =========================================================
    // 🇬🇧 ENGLISH TEMPLATES
    // =========================================================
    english: {
        // WhatsApp/Telegram (Detailed, using formatting characters like *)
        whatsapp: `*🔥 Exclusive Property Listing! 🔥*\n\nLooking for the perfect flat/flatmate in the prime area of *${location}*?\n\n*Key Highlights:*\n- Verified listing.\n- Direct Contact (No Brokerage Fee).\n- High-demand location.\n\nDon't miss out! Check full details here:\n${listingURL}\n\n#FindYourFlatmates #RealEstate #${location.replace(/\s/g, '')}`,
        
        // Facebook/Generic (Focuses on discovery and high-level interest)
        generic: `🏡 **New Opportunity in ${location}** 🔑\n\nI just found an incredible opportunity on FindYourFlatmates. Whether you're renting, buying, or seeking a flatmate, this verified listing is worth a look!\n\nLink: ${listingURL}\n\n#PropertyAlert #Investment #Housing`,
        
        // Twitter/X (Short, urgent, and focused on CTAs)
        twitter: `Prime listing available in ${location}! Great deal on FindYourFlatmates. Check details before it's gone! ➡️ ${listingURL} \n\n#Property #FlatmateSearch`,
        
        // Threads (Similar to Twitter/Generic, but often allows more space)
        threads: `Check this out! Found a highly rated property in ${location} on FindYourFlatmates. Ideal for students/professionals seeking quality housing.\n\nTap to view photos and contact owner directly: ${listingURL}`,
    },
    
    // =========================================================
    // 🇮🇳 HINDI TEMPLATES
    // =========================================================
    hindi: {
        // WhatsApp/Telegram (Detailed, using formatting characters like *)
        whatsapp: `*🔥 शानदार प्रॉपर्टी का अवसर! 🔥*\n\nक्या आप *${location}* के प्रमुख क्षेत्र में सही फ्लैट या फ्लैटमेट ढूंढ रहे हैं?\n\n*मुख्य विशेषताएँ:*\n- सत्यापित (Verified) लिस्टिंग।\n- सीधा संपर्क (कोई ब्रोकरेज शुल्क नहीं)।\n- उच्च मांग वाला स्थान।\n\nदेर न करें! पूरी जानकारी यहाँ देखें:\n${listingURL}\n\n#FindYourFlatmates #रियलएस्टेट #${location.replace(/\s/g, '')}`,
        
        // Facebook/Generic (Focuses on discovery and high-level interest)
        generic: `🏡 **${location} में नया अवसर** 🔑\n\nमुझे FindYourFlatmates पर एक अविश्वसनीय अवसर मिला है। चाहे आप किराए पर ले रहे हों, खरीद रहे हों या फ्लैटमेट ढूंढ रहे हों, यह सत्यापित लिस्टिंग देखने लायक है!\n\nलिंक: ${listingURL}\n\n#प्रॉपर्टीअलर्ट #निवेश #आवास`,
        
        // Twitter/X (Short, urgent, and focused on CTAs)
        twitter: `${location} में एक बेहतरीन लिस्टिंग उपलब्ध है! FindYourFlatmates पर शानदार डील। इससे पहले कि यह बिक जाए, विवरण देखें! ➡️ ${listingURL} \n\n#प्रॉपर्टी #फ्लैटमेट`,
        
        // Threads
        threads: `इसे ज़रूर देखें! FindYourFlatmates पर ${location} में एक उच्च-रेटेड प्रॉपर्टी मिली है। गुणवत्तापूर्ण आवास चाहने वाले छात्रों/पेशेवरों के लिए आदर्श।\n\nफ़ोटो देखने और मालिक से सीधे संपर्क करने के लिए टैप करें: ${listingURL}`,
    }
});