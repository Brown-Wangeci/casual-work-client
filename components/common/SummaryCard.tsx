import { StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import colors from '@/constants/Colors'

type Props = {
  children: React.ReactNode
  width?: number
  height?: number
  style?: object
}

const SummaryCard = ({children, width, height, style}: Props) => {
  return (
    <View style={[styles.container, {width, minHeight: height}, style]}>
      {children}
    </View>
  )
}

export default SummaryCard

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.component.green.bg,
        padding: wp('2%'),
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.component.stroke,
        borderRadius: 12,
    }
})