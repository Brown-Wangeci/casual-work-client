import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';

type Props = {
  rating: number;
  onChange: (rating: number) => void;
  size?: number;
};

const StarRatingInput: React.FC<Props> = ({ rating, onChange, size = 32 }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star)}
          style={styles.starContainer}
          activeOpacity={0.7}
        >
          <FontAwesome
            name={star <= rating ? 'star' : 'star-o'}
            size={moderateScale(size, 0.2)}
            color={star <= rating ? colors.star.filled : colors.text.light}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRatingInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: moderateScale(12, 0.2),
  },
  starContainer: {
    marginHorizontal: 8,
  },
});
