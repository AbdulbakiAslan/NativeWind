import React from "react";
import { View, Text, StyleSheet } from "react-native";

 const SignUpCompany = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>SignUpCompany - İçerik burada dolu</Text>
    </View>
  );
};

export default SignUpCompany;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});
