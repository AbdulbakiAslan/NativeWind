import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const JobPostingList = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>İş İlanı Listesi</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.buttonText}>İNDİR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.buttonText}>EKLE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterDropdown}>
          <Text style={styles.filterText}>FİLTRE</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.selectBox}>
          <Text>10</Text>
          <Text style={styles.label}> adet veri göster</Text>
        </View>

        <View style={styles.pagination}>
          <AntDesign name="doubleleft" size={24} color="#3B82F6" />
          <AntDesign name="left" size={24} color="#3B82F6" />
          <Text style={styles.pageText}>1 / 0</Text>
          <AntDesign name="right" size={24} color="#3B82F6" />
          <AntDesign name="doubleright" size={24} color="#3B82F6" />
        </View>

        <Text style={styles.infoText}>
          0 adet veriden 1 - 0 arası gösteriliyor
        </Text>
      </View>

      <Text style={styles.footer}>
        Copyright © 2025 <Text style={{ fontWeight: "bold" }}>Imo.Cv.</Text> Tüm
        hakları saklıdır
      </Text>
    </ScrollView>
  );
};

export default JobPostingList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5faff",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  downloadButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterText: {
    fontWeight: "500",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    marginLeft: 4,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 10,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 8,
  },
  infoText: {
    textAlign: "center",
    color: "#4B5563",
  },
  footer: {
    textAlign: "center",
    marginTop: 32,
    color: "#6B7280",
  },
});
