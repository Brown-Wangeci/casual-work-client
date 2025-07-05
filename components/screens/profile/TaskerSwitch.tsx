import { StyleSheet, View, Text, Switch } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '@/constants/Colors';
import { moderateScale } from 'react-native-size-matters';
import api from '@/lib/utils/axios';
import { useAuthStore } from '@/stores/authStore';
import { useCallback, useState } from 'react';
import { extractErrorMessage, logError } from '@/lib/utils';
import { showToast } from '@/lib/utils/showToast';

const TaskerSwitch = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const isEnabled = user.isTasker ?? false;

  const handleToggle = useCallback(async () => {
    const newStatus = !isEnabled;
    const previousUser = { ...user };

    // Optimistically update UI
    updateUser({ ...user, isTasker: newStatus });
    setIsUpdating(true);

    try {
      const response = await api.patch(`/user/toggle`);

      if (response.status === 200 && response.data?.user) {
        updateUser(response.data.user);
        const statusMsg = response.data.message || `You are now ${response.data.user.isTasker ? 'available' : 'unavailable'} as a Tasker.`;
        showToast('success', 'Status Updated', statusMsg);
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (error: any) {
      logError(error, 'TaskerSwitch > handleToggle');
      updateUser(previousUser);
      showToast('error', 'Failed to Update Status', extractErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  }, [isEnabled, updateUser, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Available as a Tasker</Text>
      <View style={styles.customTrack}>
        <Switch
          trackColor={{
            false: colors.component.stroke,
            true: colors.component.green.bg,
          }}
          thumbColor={isEnabled ? colors.text.green : colors.text.light}
          ios_backgroundColor={colors.component.stroke}
          onValueChange={handleToggle}
          value={isEnabled}
          disabled={isUpdating}
        />
      </View>
    </View>
  );
};

export default TaskerSwitch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.component.input,
    padding: wp('4%'),
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.component.stroke,
    borderRadius: 12,
  },
  text: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-regular',
  },
  customTrack: {
    width: wp('16%'),
    height: moderateScale(30, 0.2),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
