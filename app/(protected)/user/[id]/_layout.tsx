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
        }}
    >
      <Stack.Screen
        name='avatar'
        options={{
          presentation:'modal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  )
}

export default TasksLayout

const styles = StyleSheet.create({})