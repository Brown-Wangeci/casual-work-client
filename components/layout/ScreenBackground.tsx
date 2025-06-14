import colors from '@/constants/Colors';
import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';


type ScreenBackgroundProps = {
    children: ReactNode;
    style?: object;
};

const ScreenBackground = ({ children, style } :ScreenBackgroundProps) => {

  return (
    <View
      style={[
        styles.container,
        style
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
