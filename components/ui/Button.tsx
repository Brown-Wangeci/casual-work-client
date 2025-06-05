import { Pressable, StyleSheet, Text } from 'react-native'
import React from 'react'
import colors from '@/constants/Colors'
import { moderateScale } from 'react-native-size-matters'

type ButtonProps = {
    title: string
    onPress: () => void
    type: 'primary' | 'secondary' | 'cancel'
    small?: boolean
}

const Button = ({ title, onPress, type, small }: ButtonProps) => {
    if (small) {
        return (
            <Pressable
                onPress={onPress}
                style={[styles.smallButton, styles[type]]}
            >
                <Text style={[styles.buttonTitle, styles[`buttonTitle${type}`]]}>{title}</Text>
            </Pressable>
        )
    }

    return (
        <Pressable
        onPress={onPress}
        style={[styles.button, styles[type]]}
        >
        <Text style={[styles.buttonTitle, styles[`buttonTitle${type}`]]}>{title}</Text>
        </Pressable>
    )
}

export default Button

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