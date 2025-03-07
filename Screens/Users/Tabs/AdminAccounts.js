// Users/Tabs/AdminAccounts.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AdminAccounts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yönetici Hesapları</Text>
      <Text style={styles.placeholder}>
        Burada yönetici hesapları listelenecek.
      </Text>
    </View>
  );
};

export default AdminAccounts;

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
