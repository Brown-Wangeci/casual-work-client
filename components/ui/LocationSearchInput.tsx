import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/Colors';
import { moderateScale } from 'react-native-size-matters';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { getCurrentUserLocation } from '@/lib/utils/location';
import { fetchLocationSuggestions } from '@/lib/utils/fetchSuggestions';
import { showToast } from '@/lib/utils/showToast';

type Props = {
  onSelect: (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
};

type Suggestion = {
  id: string;
  place_name: string;
  center: [number, number];
};

export default function LocationSearchInput({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePermissionAndSetCurrent = async () => {
    const coords = await getCurrentUserLocation();
    if (coords) {
      const center: [number, number] = [coords.longitude, coords.latitude];
      setUserCoords(center);
      fetchSuggestionsDebounced(query, center);
    }
  };

  useEffect(() => {
    handlePermissionAndSetCurrent();
  }, []);

  const fetchSuggestionsDebounced = async (
    text: string,
    coords?: [number, number]
  ) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchLocationSuggestions(text, coords);
      setSuggestions(results);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      showToast('error', 'Location search failed', 'Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (text: string) => {
    setQuery(text);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestionsDebounced(text, userCoords ?? undefined);
    }, 400);
  };

  const handleSelect = (item: Suggestion) => {
    Keyboard.dismiss();
    setQuery(item.place_name);
    setSuggestions([]);
    onSelect({
      name: item.place_name,
      latitude: item.center[1],
      longitude: item.center[0],
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <Ionicons
          style={styles.searchIcon}
          name="search"
          size={moderateScale(20, 0.2)}
          color={colors.text.light}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          placeholderTextColor={colors.text.light}
          value={query}
          onChangeText={handleChange}
        />
        {loading && (
          <ActivityIndicator size="small" color={colors.text.light} />
        )}
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.suggestionText}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderRadius: 1000,
    borderColor: colors.component.stroke,
    backgroundColor: colors.component.input,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    gap: wp('2%'),
  },
  searchInput: {
    flex: 1,
    color: colors.text.bright,
    fontFamily: 'poppins-medium',
    fontSize: moderateScale(14, 0.2),
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  dropdown: {
    marginTop: hp('1%'),
    backgroundColor: colors.bg,
    borderRadius: 10,
    borderColor: colors.component.stroke,
    borderWidth: 1,
    maxHeight: hp('25%'),
  },
  suggestionItem: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderBottomColor: colors.component.stroke,
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
    fontSize: moderateScale(13, 0.2),
  },
});
