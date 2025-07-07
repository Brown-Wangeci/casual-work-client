import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';

const SearchBar = ({ onSelect }: { onSelect: (place: { name: string, coords: [number, number] }) => void }) => {
  const { results, search, loading } = usePlaceSearch();

  return (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons style={styles.searchIcon} name="search" size={moderateScale(20, 0.2)} color={colors.text.light} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          placeholderTextColor={colors.text.light}
          onChangeText={search}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              const [lng, lat] = item.center;
              onSelect({ name: item.place_name, coords: [lng, lat] });
            }}
            style={styles.suggestionItem}
          >
            <Text style={styles.suggestionText}>{item.place_name}</Text>
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderRadius: 1000,
    borderColor: colors.component.stroke,
    backgroundColor: colors.component.input,
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
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
  suggestionItem: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.component.stroke,
  },
  suggestionText: {
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
  },
});
