import colors from '@/constants/Colors'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'


type ThemedInputProps = TextInputProps

const ThemedInput: React.FC<ThemedInputProps> = ( { style, ...props } ) => {
  return (
    <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.placeholder}
        {...props}
    />
  )
}

export default ThemedInput

const styles = StyleSheet.create({
  input: {
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
    fontSize: moderateScale(14, 0.2),
    width: '100%',
    // height: hp('6.4%'),
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.component.stroke,
    backgroundColor: colors.component.input,
    paddingHorizontal: wp('5%'),
    // paddingVertical: hp('20%'),
  }
})