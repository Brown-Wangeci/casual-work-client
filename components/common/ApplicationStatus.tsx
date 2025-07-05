import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TaskApplicationStatus } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/Colors';

type ApplicationStatusProps = {
  status: TaskApplicationStatus;
};

const ApplicationStatus = ({ status }: ApplicationStatusProps) => {
  let color = colors.progress.neutral;
  let label = 'Application Pending';

  if (status === 'ACCEPTED') {
    color = colors.progress.accepted;
    label = 'Application Accepted';
  } else if (status === 'DENIED') {
    color = colors.progress.rejected;
    label = 'Application Rejected';
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Ionicons name="ellipse" size={16} color={color} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export default ApplicationStatus;

const styles = StyleSheet.create({
  text: {
    color: colors.text.light,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
