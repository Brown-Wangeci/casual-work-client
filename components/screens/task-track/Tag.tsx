import { StyleSheet, Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'

type TagProp = {
  label: string
}


const Tag = ({ label }: TagProp) => {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{ label }</Text>
    </View>
  )
}

export default Tag

const styles = StyleSheet.create({
    tag: {
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.tag.bg,
        paddingVertical: moderateScale(4, 0.2),
        paddingHorizontal: moderateScale(8, 0.2),
        borderRadius: 1000,
    },
    label: {
        color: colors.tag.label,
        fontSize: moderateScale(12, 0.2),
        fontFamily: 'poppins-semi-bold',
    },
})