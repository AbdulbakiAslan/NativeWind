// MyEducation.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyEducation = () => {
  return (
    <View style={styles.container}>
      <Text>My Education Screen</Text>
    </View>
  );
};

export default MyEducation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
