import { StyleSheet, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import colors from '@/constants/Colors'

type Props = {
  children: React.ReactNode
}

const ContentCard = ({ children }: Props) => {
  return (
    <View style={ styles.container }>
      {children}
    </View>
  )
}

export default ContentCard

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: colors.bg,
        padding: wp('4%'),
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.component.stroke,
        borderRadius: 12,
    }
})