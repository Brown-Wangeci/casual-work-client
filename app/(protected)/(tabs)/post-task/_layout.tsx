import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import colors from '@/constants/Colors'

const TasksLayout = () => {
  return (
    <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: colors.bg,
            },
            animation: 'fade_from_bottom',
        }}
    />
  )
}

export default TasksLayout

const styles = StyleSheet.create({})