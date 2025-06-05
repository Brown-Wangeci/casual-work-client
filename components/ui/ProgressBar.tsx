import colors from '@/constants/Colors'
import { StyleSheet, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

type Props = {
  percentage: number
}

const ProgressBar = ({ percentage }: Props) => {
    let color: string = colors.progress.start;
    
    if ( percentage === 100 ) {
        color = colors.progress.success;
    }else if ( percentage < 100 && percentage >= 50 ) {
        color = colors.progress.middle;
    }else if ( percentage > 100 ) {
        color = colors.progress.cancelled;
    }else{
        color = colors.progress.start;
    }

  return (
    <View style={styles.container}>
        <View style={[styles.progress, {width: `${percentage}%`, backgroundColor: color}]}></View>
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
    container: {
        height: hp('2%'),
        width: '100%',
        backgroundColor: colors.progress.bg,
        borderRadius: 1000,
        overflow: 'hidden',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: colors.progress.stroke,
    },
    progress: {
        height: '100%',
        width: '100%',
    },
})