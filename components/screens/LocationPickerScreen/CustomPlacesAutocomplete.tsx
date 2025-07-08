import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTaskCreationStore } from '@/stores/taskCreationStore';
import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons'; 
import { Pressable } from 'react-native';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
}

const CustomPlacesAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debounceRef = useRef<any>(null);
  
  const setLocation = useTaskCreationStore((state) => state.setLocation);

  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const searchPlaces = async (searchText: string) => {
    if (!searchText.trim() || searchText.length < 2) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          searchText
        )}&key=${API_KEY}&language=en&components=country:ke`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        setPredictions(data.predictions || []);
      } else {
        console.error('Places API error:', data.status, data.error_message);
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
       `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${API_KEY}`
        );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result as PlaceDetails;
      } else {
        console.error('Place details error:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    setShowSuggestions(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const handlePlaceSelect = async (place: PlacePrediction) => {
    setQuery(place.description);
    setShowSuggestions(false);
    setPredictions([]);
    
    const details = await getPlaceDetails(place.place_id);
    if (details) {
      setLocation({
        address: details.formatted_address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      });
      
      console.log('Selected location:', {
        address: details.formatted_address,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      });
    }
  };

  
  const renderSuggestion = ({ item }: { item: PlacePrediction }) => (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [
        styles.suggestionItem,
        pressed && styles.suggestionItemPressed, // Apply pressed style
      ]}
      onPress={() => handlePlaceSelect(item)}
    >
      <Ionicons name="location-outline" size={22} color={styles.secondaryText.color} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
        <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
      </View>
    </Pressable>
  );

    return (
    <View style={styles.container}>
      {/* IMPROVEMENT #2: Wrap TextInput in a View to add a search icon */}
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color={styles.secondaryText.color} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Search for a location"
          placeholderTextColor={styles.secondaryText.color} // Set placeholder color
          value={query}
          onChangeText={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          // Using onBlur can be tricky. A better way is to tap outside,
          // which keyboardShouldPersistTaps="handled" in FlatList helps with.
        />
      </View>
      
      {showSuggestions && query.length > 0 && ( // Also check for query length
        <View style={styles.suggestionsContainer}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.infoText}>Searching...</Text>
            </View>
          )}
          
          {!loading && predictions.length > 0 && (
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={renderSuggestion}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          )}
          
          {!loading && predictions.length === 0 && query.length >= 2 && (
            <View style={styles.loadingContainer}>
              <Text style={styles.infoText}>No results found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  // Style for the view wrapping the icon and text input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E', // A dark charcoal color, not pure black
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3A3A3C', // A slightly lighter gray for the border
  },
  inputIcon: {
    paddingLeft: 12,
  },
  textInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#FFFFFF', // White text color for input
    // We remove individual borders and backgrounds as the container handles it
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55, // Give it a little space from the input box
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E', // Match the input background
    borderColor: '#3A3A3C',
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 300,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C', // Subtle separator line
  },
  // New style for when a suggestion item is pressed
  suggestionItemPressed: {
    backgroundColor: '#3A3A3C',
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EFEFEF', // A slightly off-white for primary text
  },
  secondaryText: {
    fontSize: 14,
    color: '#8E8E93', // A muted gray for secondary text, good for icons too
    marginTop: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  // A single style for all informational text
  infoText: {
    marginLeft: 10,
    color: '#8E8E93',
    fontSize: 16,
  },
});

export default CustomPlacesAutocomplete;