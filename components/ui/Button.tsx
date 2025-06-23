import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '@/constants/Colors'
import { moderateScale } from 'react-native-size-matters'

type ButtonProps = {
  title: string
  onPress: () => void
  type: 'primary' | 'secondary' | 'cancel'
  small?: boolean
  loading?: boolean
}

const Button = ({ title, onPress, type, small, loading = false }: ButtonProps) => {
  const buttonStyle = small ? styles.smallButton : styles.button;

  return (
    <TouchableOpacity
      onPress={!loading ? onPress : undefined}
      style={[buttonStyle, styles[type], loading && { opacity: 0.7 }]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.button[type].text} />
      ) : (
        <Text style={[styles.buttonTitle, styles[`buttonTitle${type}`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;


const styles = StyleSheet.create({
    smallButton: {
        width: '100%',
        paddingHorizontal: moderateScale(8, 0.2),
        paddingVertical: moderateScale(4, 0.2),
        borderRadius: 12,
        borderStyle: 'solid',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        paddingHorizontal: moderateScale(16, 0.2),
        paddingVertical: moderateScale(8, 0.2),
        borderRadius: 12,
        borderStyle: 'solid',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        fontFamily: 'poppins-bold',
        fontSize: moderateScale(16, 0.2),
        lineHeight: 24,
    },
    buttonTitleprimary: {
        color: colors.button.primary.text,
    },
    buttonTitlesecondary: {
        color: colors.button.secondary.text,
    },
    buttonTitlecancel: {
        color: colors.button.cancel.text,
    },
    primary: {
        backgroundColor: colors.button.primary.bg,
        borderColor: colors.button.primary.stroke,
    },
    secondary: {
        backgroundColor: colors.button.secondary.bg,
        borderColor: colors.button.secondary.stroke,
    },
    cancel: {
        backgroundColor: colors.button.cancel.bg,
        borderColor: colors.button.cancel.stroke,
    },
})