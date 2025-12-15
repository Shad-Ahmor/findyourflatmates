// src/components/PropertyDetail/PropertyImageCarousel.jsx

import React, { useRef, useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { DEEP_SOFT_SHADOW, getWebShadow } from './DetailUtilityComponents';

// -----------------------------------------------------------------
// LOCAL STYLE GENERATOR FOR CAROUSEL
// -----------------------------------------------------------------
const getCarouselStyles = (colors, dynamicStyles, itemWidth, imageHeight) => {
    
    // Extract required dynamic constants from the dynamicStyles object
    const isMobile = dynamicStyles.isMobile; 
    const windowWidth = dynamicStyles.windowWidth; 
    const GENEROUS_RADIUS = dynamicStyles.GENEROUS_RADIUS || 30; 
    const getWebShadow = dynamicStyles.getWebShadow || (() => ({})); 
    const DEEP_SOFT_SHADOW = dynamicStyles.DEEP_SOFT_SHADOW;
    const GENERAL_TEXT_SIZE = dynamicStyles.GENERAL_TEXT_SIZE || 17;
    const MAP_ICON_SIZE = dynamicStyles.MAP_ICON_SIZE || 60;

    const navArrowIconSize = isMobile ? 24 : 30;

    return {
        // --- Image Gallery Styles (Carousel) ---
        // Aligns the carousel container to the center of the window width
        imageGalleryWrapper: { width: windowWidth, padding: 1, justifyContent:'center', alignItems: 'center' }, 
        imageGalleryContainer: { 
            position: 'relative',
            // 🔥 FIX: Set width to 90% as requested
            width: '98%', 
            height: '100%', 
            justifyContent: 'center', 
            alignItems: 'center',
            alignSelf: 'center',
        },
        navArrowButton: {
            position: 'absolute',
            top: (imageHeight / 2) - (isMobile ? 25 : 35),
            width: isMobile ? 50 : 70,
            height: isMobile ? 50 : 70,
            borderRadius: isMobile ? 25 : 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            ...getWebShadow(DEEP_SOFT_SHADOW), 
            zIndex: 10, 
            cursor: 'pointer', 
        },
        navArrowLeft: { left: 10 }, 
        navArrowRight: { right: 10 },
        navArrowIconSize: navArrowIconSize, 
        fullImage: { width: '100%', height: '100%', borderRadius: GENEROUS_RADIUS },
        noImagePlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
        noImageText: { marginTop: 15, fontSize: GENERAL_TEXT_SIZE },
        noImageIconSize: MAP_ICON_SIZE,
        paginationContainer: { position: 'absolute', bottom: isMobile ? 15 : 30, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        pagingDot: { marginHorizontal: 5, width: isMobile ? 8 : 12, height: isMobile ? 8 : 12, borderRadius: isMobile ? 4 : 6, transitionProperty: 'background-color, transform, opacity', transitionDuration: '0.3s' },
        
        // Expose a few critical constants for component logic
        GENEROUS_RADIUS,
        getWebShadow,
        DEEP_SOFT_SHADOW,
    };
};
// -----------------------------------------------------------------


const PropertyImageCarousel = ({ 
    imageLinks = [], 
    activeImageIndex, 
    setActiveImageIndex, 
    listingGoalColor, 
    dynamicStyles, 
    colors,
    itemWidth, // The full width allocated to the component by the parent container
    imageHeight
}) => {
    const totalImages = imageLinks.length;
    
    // Compute styles once and memoize them
    const carouselStyles = useMemo(() => 
        getCarouselStyles(colors, dynamicStyles, itemWidth, imageHeight), 
        [colors, dynamicStyles, itemWidth, imageHeight]
    );

    // ** UI Enhancement Constants **
    const carouselPadding = 30; 
    // 🔥 REMOVED: const DISPLAY_SCALE_FACTOR = 0.85; 

    // Dimensions used for inner card calculation (based on original size minus padding)
    const contentWidth = itemWidth * 1 - carouselPadding * 1; // Adjusted content width to 90% of itemWidth
    const contentHeight = imageHeight - carouselPadding * 4;


    // ** Navigation Handlers **
    const scrollTo = useCallback((index) => {
        if (index >= 0 && index < totalImages) {
            setActiveImageIndex(index);
        }
    }, [totalImages, setActiveImageIndex]);

    const handlePrev = useCallback(() => {
        const newIndex = activeImageIndex - 1;
        scrollTo(newIndex);
    }, [activeImageIndex, scrollTo]);

    const handleNext = useCallback(() => {
        const newIndex = activeImageIndex + 1;
        scrollTo(newIndex);
    }, [activeImageIndex, scrollTo]);
    // ** End Navigation Handlers **

    // ------------------------------------------------
    // CARD RENDERING LOGIC (Enhanced 3D Effect)
    // ------------------------------------------------
    const getCardStyle = (index) => {
        const distance = index - activeImageIndex;
        
        // 1. Exiting Cards (Cards that are no longer visible)
        if (distance < 0 || distance > 2) {
            return { display: 'none' };
        }
        
        // 2. Active Card (distance === 0)
        if (distance === 0) {
            return {
                transform: [{ scale: 1 }, { rotate: '0deg' }],
                opacity: 1,
                zIndex: 3, 
                // Apply shadow only to the active image card
                ...carouselStyles.getWebShadow(carouselStyles.DEEP_SOFT_SHADOW), 
            };
        }

        // 3. 1st Stacked Card (distance === 1)
        if (distance === 1) {
            return {
                transform: [
                    { scale: 0.93 }, 
                    { translateY: contentHeight * 0.03 }, 
                    { rotate: '4deg' }
                ], 
                opacity: 0.8,
                zIndex: 2,
            };
        }
        
        // 4. 2nd Stacked Card (distance === 2)
        if (distance === 2) {
            return {
                transform: [
                    { scale: 0.86 }, 
                    { translateY: contentHeight * 0.06 }, 
                    { rotate: '-4deg' }
                ], 
                opacity: 0.6,
                zIndex: 1,
            };
        }
    };


    return (
        <View style={[carouselStyles.imageGalleryWrapper, { height: imageHeight + carouselPadding * 2 }]}>
            <View 
                style={[
                    carouselStyles.imageGalleryContainer, 
                    { 
                        // The CSS definition sets width: '90%'
                        
                        // Set explicit pixel height, width is 90% of itemWidth
                        width: '90%', 
                        height: imageHeight + carouselPadding * 2, 

                        padding: carouselPadding, 
                        
                        // Remove the visual 'card' elements
                        backgroundColor: 'transparent', 
                        borderRadius: 0, 
                        
                        perspective: 1000, 
                    }
                ]}
            > 
                {Array.isArray(imageLinks) && imageLinks.length > 0 ? (
                    <>
                        {/* ------------------------------------------- */}
                        {/* CARD STACK VIEW */}
                        {/* ------------------------------------------- */}
                        <View 
                            style={{ 
                                // The dimensions of this view are based on the calculated content area
                                width: contentWidth, 
                                height: contentHeight, 
                                position: 'relative', 
                                borderRadius:'20px'
                            }}
                        >
                            {imageLinks.map((imageUrl, index) => {
                                const cardStyle = getCardStyle(index);
                                
                                if (cardStyle.display === 'none') return null;

                                return (
                                    <View 
                                        key={index}
                                        style={[
                                            { 
                                                position: 'absolute', 
                                                width: '100%', 
                                                height: '100%', 
                                                transitionProperty: 'transform, opacity, box-shadow', 
                                                transitionDuration: '0.4s',
                                                transitionTimingFunction: 'ease-in-out',
                                            },
                                            cardStyle
                                        ]}
                                    > 
                                        <Image
                                            source={{ uri: imageUrl }}
                                            style={[carouselStyles.fullImage, { 
                                                width: '100%', 
                                                height: '100%',
                                                borderRadius: carouselStyles.GENEROUS_RADIUS - 5, 
                                            }]} 
                                            resizeMode="cover"
                                        />
                                    </View>
                                );
                            })}
                        </View>


                        {/* Pagination Dots */}
                        <View style={carouselStyles.paginationContainer}>
                            {imageLinks.map((_, index) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => scrollTo(index)} 
                                    style={[
                                        carouselStyles.pagingDot,
                                        { 
                                            backgroundColor: index === activeImageIndex ? listingGoalColor : colors.text + '50', 
                                            transform: [{ scale: index === activeImageIndex ? 1.5 : 1 }], 
                                            opacity: index === activeImageIndex ? 1 : 0.6,
                                        },
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Navigation Arrows */}
                        {activeImageIndex > 0 && (
                            <TouchableOpacity
                                onPress={handlePrev}
                                style={[carouselStyles.navArrowButton, carouselStyles.navArrowLeft, { 
                                    left: carouselPadding - 10, 
                                    backgroundColor: colors.card + 'D0', 
                                    borderColor: colors.border,
                                }]}
                            >
                                <Icon name="chevron-back-outline" size={carouselStyles.navArrowIconSize} color={colors.text} />
                            </TouchableOpacity>
                        )}
                        
                        {activeImageIndex < totalImages - 1 && (
                            <TouchableOpacity
                                onPress={handleNext}
                                style={[carouselStyles.navArrowButton, carouselStyles.navArrowRight, { 
                                    right: carouselPadding - 10,
                                    backgroundColor: colors.card + 'D0',
                                    borderColor: colors.border,
                                }]}
                            >
                                <Icon name="chevron-forward-outline" size={carouselStyles.navArrowIconSize} color={colors.text} />
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <View style={carouselStyles.noImagePlaceholder}>
                        <Icon name="image-outline" size={carouselStyles.noImageIconSize} color={colors.text + '50'} />
                        <Text style={[carouselStyles.noImageText, { color: colors.text + '80' }]}>Images Unavailable</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default PropertyImageCarousel;