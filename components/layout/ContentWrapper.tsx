import colors from '@/constants/Colors';
import { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'


type ContentWrapperProps = {
    children: ReactNode;
    style?: object;
};

const ContentWrapper = ({ children, style } :ContentWrapperProps) => {

  return (
    <View
      style={[
        styles.container,
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ContentWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        width: wp('90%'),
        overflow: 'hidden', 
    },
});
