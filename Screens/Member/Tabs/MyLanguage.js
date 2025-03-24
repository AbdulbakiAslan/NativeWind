// MyLanguage.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MyLanguage = () => {
  return (
    <View style={styles.container}>
      <Text>My Language Screen</Text>
    </View>
  );
};

export default MyLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
