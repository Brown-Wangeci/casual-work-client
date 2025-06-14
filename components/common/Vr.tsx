import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '@/constants/Colors'

const Vr = () => {
  return (
    <View style={styles.verticalLine}></View>
  )
}

export default Vr

const styles = StyleSheet.create({
    verticalLine: {
        width: 1,
        height: '100%',
        backgroundColor: colors.component.stroke,
        marginHorizontal: 10,
    },
})