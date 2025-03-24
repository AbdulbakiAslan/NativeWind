// MyCertificates.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyCertificates = () => {
  return (
    <View style={styles.container}>
      <Text>My Certificates Screen</Text>
    </View>
  );
};

export default MyCertificates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
