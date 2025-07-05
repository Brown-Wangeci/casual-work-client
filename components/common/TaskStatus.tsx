import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Status } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/Colors';

type TaskStatusProps = {
  status: Status;
};

const TaskStatus = ({ status }: TaskStatusProps) => {
  const colorMap: Record<Status, string> = {
    CREATED: colors.progress.start,
    PENDING: colors.progress.pending,
    IN_PROGRESS: colors.progress.inProgress,
    REVIEW: colors.progress.review,
    COMPLETED: colors.progress.success,
    CANCELLED: colors.progress.cancelled,
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name="ellipse" size={16} color={colorMap[status]} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

export default TaskStatus;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.light,
  },
});
