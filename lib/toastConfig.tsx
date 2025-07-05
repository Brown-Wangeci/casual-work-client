import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/Colors';

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <ThemedToast
      icon="checkmark-circle"
      color={colors.progress.success}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2 }: any) => (
    <ThemedToast
      icon="close-circle"
      color={colors.progress.cancelled}
      text1={text1}
      text2={text2}
    />
  ),
  info: ({ text1, text2 }: any) => (
    <ThemedToast
      icon="information-circle"
      color={colors.progress.inProgress}
      text1={text1}
      text2={text2}
    />
  ),
};

type ThemedToastProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  text1: string;
  text2?: string;
};

const ThemedToast = ({ icon, color, text1, text2 }: ThemedToastProps) => (
  <View style={[styles.toastContainer, { borderLeftColor: color }]}>
    <Ionicons name={icon} size={20} color={color} style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
    backgroundColor: colors.component.bg,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.bright,
    fontFamily: 'poppins-bold',
  },
  message: {
    fontSize: 12,
    color: colors.text.light,
    fontFamily: 'poppins-regular',
    marginTop: 4,
  },
});
