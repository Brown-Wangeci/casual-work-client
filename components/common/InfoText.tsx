import { Text } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'


type InfoTextProps = {
    children: React.ReactNode
    style?: object
}

const InfoText = ( { children, style }: InfoTextProps ) => {
  return (
    <Text style={[{ color: colors.infoText, fontSize: moderateScale(12, 0.2), fontFamily: 'poppins-regular' }, style]}>
        {children}
    </Text>
  )
}

export default InfoText