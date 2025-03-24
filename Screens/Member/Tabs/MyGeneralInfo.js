// MyGeneralInfo.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyGeneralInfo = () => {
  return (
    <View style={styles.container}>
      <Text>My General Info Screen</Text>
    </View>
  );
};

export default MyGeneralInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
