// MyReferences.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyReferences = () => {
  return (
    <View style={styles.container}>
      <Text>My References Screen</Text>
    </View>
  );
};

export default MyReferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
