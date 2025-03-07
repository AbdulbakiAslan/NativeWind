// Users/Tabs/MemberAccounts.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MemberAccounts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Üye Hesapları</Text>
      <Text style={styles.placeholder}>
        Burada üye hesapları listelenecek.
      </Text>
    </View>
  );
};

export default MemberAccounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: "#666",
  },
});
