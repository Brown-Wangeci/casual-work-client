import React, { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'

type ThemedInputProps = TextInputProps

const ThemedInput: React.FC<ThemedInputProps> = ({
  style,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const showToggle = secureTextEntry !== undefined

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.text.placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        {...props}
      />
      {showToggle && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.iconWrapper}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={colors.text.light}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ThemedInput

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
    fontSize: moderateScale(14, 0.2),
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.component.stroke,
    backgroundColor: colors.component.input,
    paddingHorizontal: wp('5%'),
    paddingRight: wp('12%'), // Make space for eye icon
  },
  iconWrapper: {
    position: 'absolute',
    right: wp('4%'),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
