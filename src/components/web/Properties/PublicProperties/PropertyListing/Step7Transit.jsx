import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SUBTLE_SHADOW, DISTANCE_UNITS } from './PropertyCreate.web';

/* ----------------------------------------
   ✅ FIXED mergeStyles (accepts multiple)
-----------------------------------------*/
const mergeStyles = (...styles) =>
  Platform.select({
    web: Object.assign({}, ...styles.filter(Boolean)),
    default: Object.assign({}, ...styles.filter(Boolean)),
  });

/* ----------------------------------------
   Global Distance Unit Selector
-----------------------------------------*/
const DistanceUnitSelector = ({ distanceUnit, setDistanceUnit, styles, isLoading }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      Select Standard Distance Unit
      <Text style={{ color: COLORS.primaryCTA, fontWeight: '900' }}>
        {' '} (Applies to all inputs below)
      </Text>
    </Text>

    <View style={styles.selectorContainer}>
      {DISTANCE_UNITS.map(unit => (
        <TouchableOpacity
          key={unit}
          style={mergeStyles(
            styles.selectorButton,
            distanceUnit === unit && styles.selectorButtonActive,
            SUBTLE_SHADOW
          )}
          onPress={() => setDistanceUnit(unit)}
          disabled={isLoading}
        >
          <Text
            style={
              distanceUnit === unit
                ? styles.selectorTextActive
                : styles.selectorText
            }
          >
            {unit}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

/* ----------------------------------------
   Reusable Proximity Input (Modified)
-----------------------------------------*/
const ProximityInput = ({
  title,
  poiType,
  list,
  setList,
  showToast,
  styles,
  isLoading,
  distanceUnit,
}) => {
  const [name, setName] = useState('');
  const [distanceValue, setDistanceValue] = useState('');

  // 🔥 AUTO COMMIT FUNCTION
  const commitPOIIfValid = () => {
    // Dono fields empty ho to ignore
    if (!distanceValue.trim() && !name.trim()) return;

    // Distance mandatory
    if (!distanceValue.trim()) {
      showToast(`Please enter distance for ${title}`, 'error');
      return;
    }

    const newPoint = {
      id: Date.now(),
      type: poiType,
      name: name.trim() || poiType,
      distance: `${distanceValue.trim()} ${distanceUnit}`,
    };

    setList(prev => [...prev, newPoint]);

    // Clear local input fields
    setName('');
    setDistanceValue('');
  };

  const handleAddPOI = () => {
    commitPOIIfValid();
  };

  const handleRemovePOI = id => {
    setList(prev => prev.filter(p => p.id !== id));
  };

  return (
    <View style={styles.proximityInputGroup}>
      <Text style={styles.labelSmall}>
        {title} <Text style={{ color: COLORS.textLight }}>(Optional)</Text>
      </Text>

      <View style={styles.proximityInputRow}>
        <TextInput
          style={mergeStyles(styles.textInput, styles.proximityInputNameGlobalUnit)}
          placeholder="Name (optional)"
          value={name}
          onChangeText={setName}
          onBlur={commitPOIIfValid} // 🔥 AUTO ADD on blur
          editable={!isLoading}
        />

        <TextInput
          style={mergeStyles(styles.textInput, styles.proximityInputDistanceValueGlobal)}
          placeholder={`Distance (${distanceUnit})`}
          value={distanceValue}
          onChangeText={t => setDistanceValue(t.replace(/[^0-9.]/g, ''))}
          keyboardType="numeric"
          onBlur={commitPOIIfValid} // 🔥 AUTO ADD on blur
          editable={!isLoading}
        />

        <View style={styles.proximityUnitStaticContainer}>
          <Text style={styles.proximityUnitStaticText}>{distanceUnit}</Text>
        </View>

        <TouchableOpacity
          style={mergeStyles(styles.addButtonSmall, SUBTLE_SHADOW)}
          onPress={handleAddPOI}
          disabled={isLoading || !distanceValue}
        >
          <Icon name="add" size={20} color={COLORS.cardBackground} />
        </TouchableOpacity>
      </View>

      <View style={styles.imagePreviewContainer}>
        {list.map(point => (
          <View
            key={point.id}
            style={mergeStyles(
              styles.imagePill,
              SUBTLE_SHADOW,
              { backgroundColor: COLORS.secondaryTeal + '10' }
            )}
          >
            <Text style={styles.imageText} numberOfLines={1}>
              {point.name}: {point.distance}
            </Text>

            <TouchableOpacity onPress={() => handleRemovePOI(point.id)}>
              <Icon name="close-circle" size={20} color={COLORS.errorRed} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

/* ----------------------------------------
   STEP 7 – Transit (FINAL)
-----------------------------------------*/
const Step7Transit = ({
  transitPoints,
  setTransitPoints,
  isLoading,
  showToast,
  styles,
  distanceUnit,
  setDistanceUnit,
}) => {

  // 🚆 Individual Transit State Hooks
  const [railwayList, setRailwayList] = useState([]);
  const [airportList, setAirportList] = useState([]);
  const [busList, setBusList] = useState([]);
  const [metroList, setMetroList] = useState([]);
  const [autoList, setAutoList] = useState([]);

  // 🔄 Split backend data (EDIT MODE – run once)
  useEffect(() => {
    if (!transitPoints || transitPoints.length === 0) return;

    setRailwayList(transitPoints.filter(p => p.type === 'Railway Station'));
    setAirportList(transitPoints.filter(p => p.type === 'Airport'));
    setBusList(transitPoints.filter(p => p.type === 'Bus Stop'));
    setMetroList(transitPoints.filter(p => p.type === 'Metro Station'));
    setAutoList(transitPoints.filter(p => p.type === 'Auto Stand'));
  }, []);

  // 🧩 Merge all lists → parent state
  useEffect(() => {
    const merged = [
      ...railwayList,
      ...airportList,
      ...busList,
      ...metroList,
      ...autoList,
    ];
    setTransitPoints(merged);
  }, [railwayList, airportList, busList, metroList, autoList]);

  return (
    <View>
      <Text style={styles.sectionTitle}>7. Proximity: Transit Points</Text>
      <Text style={styles.helperText}>
        Add nearby transit points. Distance unit applies to Steps 7, 8 & 9.
      </Text>

      <DistanceUnitSelector
        distanceUnit={distanceUnit}
        setDistanceUnit={setDistanceUnit}
        styles={styles}
        isLoading={isLoading}
      />

      <View style={styles.divider} />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Transit</Text>

        <ProximityInput
          title="Nearest Railway Station Distance"
          poiType="Railway Station"
          list={railwayList}
          setList={setRailwayList}
          showToast={showToast}
          styles={styles}
          isLoading={isLoading}
          distanceUnit={distanceUnit}
        />

        <ProximityInput
          title="Nearest Airport Distance"
          poiType="Airport"
          list={airportList}
          setList={setAirportList}
          showToast={showToast}
          styles={styles}
          isLoading={isLoading}
          distanceUnit={distanceUnit}
        />

        <ProximityInput
          title="Nearest Bus Stop Distance"
          poiType="Bus Stop"
          list={busList}
          setList={setBusList}
          showToast={showToast}
          styles={styles}
          isLoading={isLoading}
          distanceUnit={distanceUnit}
        />

        <ProximityInput
          title="Nearest Metro Station Distance"
          poiType="Metro Station"
          list={metroList}
          setList={setMetroList}
          showToast={showToast}
          styles={styles}
          isLoading={isLoading}
          distanceUnit={distanceUnit}
        />

        <ProximityInput
          title="Nearest Auto Stand Distance"
          poiType="Auto Stand"
          list={autoList}
          setList={setAutoList}
          showToast={showToast}
          styles={styles}
          isLoading={isLoading}
          distanceUnit={distanceUnit}
        />
      </View>
    </View>
  );
};

export default Step7Transit;
