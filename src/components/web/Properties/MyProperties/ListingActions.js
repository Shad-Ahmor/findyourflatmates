// src/utils/ListingActions.js

import { Alert } from 'react-native';
// सुनिश्चित करें कि आप @env से API_BASE_URL आयात कर सकते हैं या इसे यहाँ हार्डकोड कर सकते हैं
// या इसे फ़ंक्शन में पास कर सकते हैं। सुविधा के लिए, मैं इसे फ़ंक्शन में पास कर रहा हूँ।
// यदि यह Node.js वातावरण में चलेगा, तो API_BASE_URL को कहीं और से आयात करने की आवश्यकता होगी।

const BASE_LISTING_ENDPOINT = (API_BASE_URL) => `${API_BASE_URL}/flatmate/listing`; 

/**
 * लिस्टिंग को डिलीट करने के लिए API को कॉल करता है।
 * @param {string} listingId - डिलीट की जाने वाली लिस्टिंग की ID।
 * @param {string} API_BASE_URL - API का बेस URL।
 * @param {function} onComplete - सफलता या विफलता पर कॉल किया जाने वाला कोलबैक।
 */
const confirmDelete = async (listingId, API_BASE_URL, onComplete) => {
     try {
        const response = await fetch(`${BASE_LISTING_ENDPOINT(API_BASE_URL)}/${listingId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            Alert.alert("Success", "Listing deleted successfully!");
            onComplete({ success: true, listingId });
        } else {
            if (response.status === 401 || response.status === 403) {
                Alert.alert("Authentication Required", "Your session has expired or you lack permission.");
                onComplete({ success: false, error: 'Unauthorized' });
                return;
            }
            
            const errorData = await response.json();
            Alert.alert("Deletion Failed", errorData.message || "Could not delete listing.");
            onComplete({ success: false, error: errorData.message || 'Deletion failed' });
        }
    } catch (error) {
        console.error("Delete Error:", error);
        Alert.alert("Network Error", "Could not connect to server to delete listing.");
        onComplete({ success: false, error: 'Network Error' });
    }
};

/**
 * लिस्टिंग डिलीट करने के लिए पुष्टि डायलॉग दिखाता है।
 * @param {string} listingId - डिलीट की जाने वाली लिस्टिंग की ID।
 * @param {string} API_BASE_URL - API का बेस URL।
 * @param {function} onDeletionSuccess - सफलता पर कॉल किया जाने वाला कोलबैक (सेटलिस्टिंग्स अपडेट करने के लिए)।
 */
export const handleDeleteListing = (listingId, API_BASE_URL, onDeletionSuccess) => {
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this property listing permanently?",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: () => confirmDelete(listingId, API_BASE_URL, ({ success, listingId: deletedId }) => {
                    if (success) {
                        onDeletionSuccess(deletedId);
                    }
                }) 
            },
        ]
    );
};