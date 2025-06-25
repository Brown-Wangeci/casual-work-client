import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const Loading = ({message = 'Loading'}: { message?: string}) => {

  console.log(message);

  const bar1 = useRef(new Animated.Value(1)).current;
  const bar2 = useRef(new Animated.Value(1)).current;
  const bar3 = useRef(new Animated.Value(1)).current;

  const animateBar = (bar: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bar, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bar, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBar(bar1, 0);
    animateBar(bar2, 250);
    animateBar(bar3, 500);
  }, []);

  return (
    <View style={styles.loader}>
      <Animated.View style={[styles.bar, { transform: [{ scaleY: bar1 }] }]} />
      <Animated.View style={[styles.bar, styles.middleBar, { transform: [{ scaleY: bar2 }] }]} />
      <Animated.View style={[styles.bar, { transform: [{ scaleY: bar3 }] }]} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  bar: {
    width: 3,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  middleBar: {
    height: 35,
    marginHorizontal: 5,
  },
});
