// MyWorkExperience.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyWorkExperience = () => {
  return (
    <View style={styles.container}>
      <Text>My Work Experience Screen</Text>
    </View>
  );
};

export default MyWorkExperience;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
