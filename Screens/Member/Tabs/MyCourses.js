// MyCourses.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyCourses = () => {
  return (
    <View style={styles.container}>
      <Text>My Courses Screen</Text>
    </View>
  );
};

export default MyCourses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
