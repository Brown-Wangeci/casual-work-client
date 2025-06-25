import colors from '@/constants/Colors'
import { Pressable, StyleSheet, Text } from 'react-native'
import { moderateScale } from 'react-native-size-matters'

type TaskTabProps = {
    title: string
    onPress: () => void
    tab: 'Posted' | 'Assigned' | 'Applied'
}

const TaskTab = ({ title, onPress, tab }: TaskTabProps) => {

    if (tab !== title) {
        return (
            <Pressable
                onPress={onPress}
                style={[styles.taskTab, styles.secondary]}
            >
                <Text style={[styles.taskTabTitle, styles.taskTabTitleSecondary]}>{title}</Text>
            </Pressable>
        )
    }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.taskTab, styles.primary]}
    >
      <Text style={[styles.taskTabTitle, styles.taskTabTitlePrimary]}>{title}</Text>
    </Pressable>
  )
}

export default TaskTab

const styles = StyleSheet.create({
    taskTab: {
        paddingHorizontal: moderateScale(6, 0.2),
        paddingVertical: moderateScale(6, 0.2),
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '33.333%',
    },
    taskTabTitle: {
        fontFamily: 'poppins-bold',
        fontSize: moderateScale(12, 0.2),
    },
    taskTabTitlePrimary: {
        color: colors.button.primary.text,
    },
    taskTabTitleSecondary: {
        color: colors.button.secondary.text,
    },
    primary: {
        backgroundColor: colors.button.primary.bg,
    },
    secondary: {
        backgroundColor: colors.transparent,
    }
})