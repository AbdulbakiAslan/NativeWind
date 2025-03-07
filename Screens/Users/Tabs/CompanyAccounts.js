// Users/Tabs/CompanyAccounts.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CompanyAccounts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şirket Hesapları</Text>
      <Text style={styles.placeholder}>
        Burada şirket hesapları listelenecek.
      </Text>
    </View>
  );
};

export default CompanyAccounts;

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
