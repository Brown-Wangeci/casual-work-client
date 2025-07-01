import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TaskApplicationStatus } from '@/constants/Types'
import { Ionicons } from '@expo/vector-icons'
import colors from '@/constants/Colors'

type ApplicationStatusProps = {
  status: TaskApplicationStatus
}

const ApplicationStatus = ( {  status }: ApplicationStatusProps ) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="ellipse" size={16} color={status === 'ACCEPTED' ? 'green' : status === 'DENIED' ? 'red' : 'orange'} />
        <Text style={{ color: colors.text.light, fontSize: 12, fontWeight: 'bold' }}>
          {status === 'ACCEPTED' ? 'Application Accepted' : status === 'DENIED' ? 'Application Rejected' : 'Application Pending'}
        </Text>
    </View>
  )
}

export default ApplicationStatus

const styles = StyleSheet.create({})