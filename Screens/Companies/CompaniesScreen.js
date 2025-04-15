import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetRealApi, PutRealApi } from "../../Components/ApiService";

const CompaniesScreen = () => {
  const [companyData, setCompanyData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  const fetchCompanyData = async () => {
    setLoading(true);
    const response = await GetRealApi("GetMyUserData", navigation);
    if (response && response.roles.includes("company")) {
      const data = {
        name: response.name || "",
        email: response.email || "",
        address: response.address || "Ulutek teknopark",
        phone: response.phone || "05538961629",
      };
      setCompanyData(data);
      setEditedData(data);
    } else {
      setCompanyData(null);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompanyData();
    }, [navigation])
  );

  const handleChange = (key, value) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!editedData.phone || editedData.phone.trim() === "") {
      ToastAndroid.show("Telefon boş olamaz!", ToastAndroid.SHORT);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editedData.email)) {
    ToastAndroid.show("Geçersiz email formatı!", ToastAndroid.SHORT);
    return;
  }

    const result = await PutRealApi("MyCompany", editedData, navigation);
    if (result) {
      setCompanyData(editedData);
      setIsEditing(false);
      ToastAndroid.show("✅ Başarıyla güncellendi!", ToastAndroid.SHORT);
    }
  };

  const handleCancel = () => {
    setEditedData(companyData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!companyData) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "gray" }}>Şirket verisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullPage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Şirket Detayları</Text>
        <View style={styles.card}>
          <Text style={styles.label}>İsim</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          ) : (
            <Text style={styles.value}>{companyData.name}</Text>
          )}

          <Text style={styles.label}>Adres</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.address}
              onChangeText={(text) => handleChange("address", text)}
            />
          ) : (
            <Text style={styles.value}>{companyData.address}</Text>
          )}

          <Text style={styles.label}>Telefon</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.phone}
              onChangeText={(text) => handleChange("phone", text)}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{companyData.phone}</Text>
          )}

          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.value}>{companyData.email}</Text>
          )}

          {isEditing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>İPTAL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>KAYDET</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>DÜZENLE</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Text style={styles.footer}>
        Copyright © 2025 <Text style={{ fontWeight: "bold" }}>Imo.Cv.</Text> Tüm
        hakları saklıdır
      </Text>
    </View>
  );
};

export default CompaniesScreen;

const styles = StyleSheet.create({
  fullPage: {
    flex: 1,
    backgroundColor: "#f5faff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
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
    marginBottom: 24,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
    borderRadius: 6,
    padding: 10,
  },
  editButton: {
    marginTop: 16,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#6B7280",
    paddingBottom: 16,
  },
});
