import { StyleSheet, View, Text, Switch, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import colors from '@/constants/Colors'
import { moderateScale } from 'react-native-size-matters'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/authStore'


const TaskerSwitch = ( ) => {

    const user = useAuthStore((state) => state.user);
    const updateUser = useAuthStore((state) => state.updateUser);

    if (!user) return null;

    const isEnabled = user.isTasker ?? false;

    // Function to handle the switch toggle
    const handleToggle = async () => {
        const newStatus = !isEnabled;

        try {
            const response = await api.patch(`/users/${user.id}`,{ isTasker: newStatus });
            if (response.status === 200) {
                updateUser({ isTasker: newStatus });
                Alert.alert('Success', `Tasker status updated to ${newStatus ? 'available' : 'not available'}.`);
            } else {
                console.error('Failed to update tasker status');
                Alert.alert('Error', 'Failed to update tasker status. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating tasker status:', error);
            Alert.alert('Error', 'Failed to update tasker status. Please try again later.');
        }
    };

  return (
    <View style={ styles.container }>
        <Text style={styles.text}>Available as a Tasker</Text>
        <View
            style={[styles.customTrack]}
        >
            <Switch
                trackColor={{ false: 'transparent', true: 'transparent' }}
                thumbColor={ isEnabled ? colors.text.green : colors.component.green.bg }
                ios_backgroundColor={colors.component.stroke}
                onValueChange={handleToggle}
                value={isEnabled}
            />
        </View>
    </View>
  )
}

export default TaskerSwitch

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
        backgroundColor: colors.component.input,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.component.stroke,
        borderRadius: 20,
        height: moderateScale(30, 0.2),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp('.5%'),
    }
})