import React from "react";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "@/constants/Colors";

type Props = {
  rating: number; 
  size: number;
};

const StarRating = ({ rating, size }: Props) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }, (_, index) => {
        const iconName =
          rating >= index + 1
            ? "star" // Full star
            : rating >= index + 0.5
            ? "star-half-full" // Half star
            : "star-o"; // Empty star

        return (
          <FontAwesome key={index} name={iconName} size={size} color={colors.star.filled} style={{ marginRight: 2 }} />
        );
      })}
    </View>
  );
};

export default StarRating;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp('1%'),
  },
});