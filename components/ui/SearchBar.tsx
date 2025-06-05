import colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TextInput, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
        <Ionicons style={styles.searchIcon} name="search" size={moderateScale(20, 0.2)} color={colors.text.light} />
        <TextInput
            style={styles.searchInput}
            placeholder="Search...."
            placeholderTextColor={colors.text.light}
        />
    </View>
  )
}

export default SearchBar

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

})