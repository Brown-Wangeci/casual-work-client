import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Status } from '@/constants/Types'
import { Ionicons } from '@expo/vector-icons'
import colors from '@/constants/Colors'

type TaskStatusProps = {
  status: Status
}

const TaskStatus = ({ status }: TaskStatusProps ) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8}}>
      <Ionicons name="ellipse" size={16} color={status === 'COMPLETED' ? 'green' : status === 'CANCELLED' ? 'red' : status === 'CREATED' ? 'turquoise' : status === 'PENDING' ? 'orange' : 'yellow' } />
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.text.light  }}>
        {status}
      </Text>
    </View>
  )
}

export default TaskStatus

const styles = StyleSheet.create({})