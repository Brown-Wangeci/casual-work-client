import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '@/constants/Colors';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
  percentage: number;
};

const ProgressBar = ({ percentage }: Props) => {
  let progressColor: string;

  if (percentage >= 101) {
    progressColor = colors.progress.cancelled;
  } else if (percentage >= 100) {
    progressColor = colors.progress.success;
  } else if (percentage >= 75) {
    progressColor = colors.progress.review;
  } else if (percentage >= 50) {
    progressColor = colors.progress.inProgress;
  } else if (percentage >= 25) {
    progressColor = colors.progress.pending;
  } else {
    progressColor = colors.progress.start;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progress,
          {
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: progressColor,
          },
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    height: hp('2%'),
    width: '100%',
    backgroundColor: colors.progress.bg,
    borderRadius: 1000,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.progress.stroke,
  },
  progress: {
    height: '100%',
  },
});
