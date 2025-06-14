import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '@/constants/Colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


const Hr = () => {
  return (
    <View style={styles.hr}></View>
  )
}

export default Hr

const styles = StyleSheet.create({
    hr: {
        width: '100%',
        height: 1,
        backgroundColor: colors.component.stroke,
        marginVertical: hp('2%'),
    },
})