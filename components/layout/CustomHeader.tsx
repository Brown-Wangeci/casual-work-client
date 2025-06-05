import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation  } from 'expo-router';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';


type CustomHeaderProps = {
    title: string
    showBackButton?: boolean
}

const CustomHeader = ({ title, showBackButton }: CustomHeaderProps) => {

    const navigation = useNavigation();

  return (
    <View style={styles.header}>
        { showBackButton && (
            <TouchableOpacity onPress={() =>  navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: wp('3%'),
        paddingTop: hp('3%'),
        paddingHorizontal: wp('6%'),
        borderBottomWidth: 1,
        borderBottomColor: colors.component.stroke,
        backgroundColor: colors.bg,
    },
    title: {
        color: colors.text.bright,
        fontSize: moderateScale(20, 0.2),
        fontFamily: 'poppins-semi-bold',
        lineHeight: moderateScale(28, 0.2),
    },
    backButton: {
        marginRight: wp('4%'),
    },
});