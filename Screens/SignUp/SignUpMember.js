import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SignUpMember = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SignUpMember - İçerik burada dolu</Text>
    </View>
  );
};

export default SignUpMember;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
