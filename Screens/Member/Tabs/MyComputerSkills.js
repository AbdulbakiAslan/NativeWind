// MyComputerSkills.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyComputerSkills = () => {
  return (
    <View style={styles.container}>
      <Text>My Computer Skills Screen</Text>
    </View>
  );
};

export default MyComputerSkills;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
