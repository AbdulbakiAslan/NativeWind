// UsersScreen.js
import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import EditUserTabs from "./Tabs/EditUserTabs";

const UsersScreen = () => {
  const navigation = useNavigation();

  const handleAddUser = () => {
    navigation.navigate("AddUser");
    console.log("Yeni kullanıcı ekleme ekranına gidiliyor...");
  };

  return (
    <View style={styles.container}>
      {/* Üst Kısım: Arama alanı ve Ekle butonu */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>
      <EditUserTabs />
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
