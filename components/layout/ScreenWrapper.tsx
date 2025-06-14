import colors from '@/constants/Colors';
import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type ScreenWrapperProps = {
    children: ReactNode;
    style?: object;
};

const ScreenWrapper = ({ children, style } :ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        style,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
