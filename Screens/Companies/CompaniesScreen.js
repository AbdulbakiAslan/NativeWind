import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Modal,
  ToastAndroid,
  Alert 
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../Components/ApiService";
import { MaterialIcons } from "@expo/vector-icons";

const CompaniesScreen = () => {
  const navigation = useNavigation();
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add Modal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  // Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const fetchCompanies = async () => {
    setLoading(true);
    const resp = await GetRealApi("Company", navigation);
    const list = Array.isArray(resp) ? resp : [];
    setCompanies(list);
    setFiltered(list);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompanies();
    }, [navigation])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanies().finally(() => setRefreshing(false));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setFiltered(companies);
      return;
    }
    setFiltered(
      companies.filter((item) =>
        `${item.name} ${item.address} ${item.phone} ${item.email}`
          .toLowerCase()
          .includes(text.toLowerCase())
      )
    );
  };

  // ADD Handlers
  const handleAddChange = (key, value) => {
    setNewCompany((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSubmit = async () => {
    if (!newCompany.name.trim()) {
      ToastAndroid.show("Şirket İsmi boş olamaz!", ToastAndroid.SHORT);
      return;
    }
    const result = await PostRealApi("Company", newCompany, navigation);
    if (result) {
      ToastAndroid.show("✅ Şirket eklendi!", ToastAndroid.SHORT);
      setAddModalVisible(false);
      setNewCompany({ name: "", address: "", phone: "", email: "" });
      fetchCompanies();
    } else {
      ToastAndroid.show("❌ Ekleme başarısız.", ToastAndroid.SHORT);
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
    setNewCompany({ name: "", address: "", phone: "", email: "" });
  };

  // EDIT Handlers
  const handleEditClick = (item) => {
    setCurrentCompany(item);
    setEditModalVisible(true);
  };

  const handleEditChange = (key, value) => {
    setCurrentCompany((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditSubmit = async () => {
    if (!currentCompany.name.trim()) {
      ToastAndroid.show("Şirket İsmi boş olamaz!", ToastAndroid.SHORT);
      return;
    }
    // PUT {{baseUrl}}/api/Company
    const result = await PutRealApi("Company", currentCompany, navigation);
    if (result) {
      ToastAndroid.show("🔄 Şirket güncellendi!", ToastAndroid.SHORT);
      setEditModalVisible(false);
      setCurrentCompany({ id:"", name: "", address: "", phone: "", email: "" });
      fetchCompanies();
    } else {
      ToastAndroid.show("❌ Güncelleme başarısız.", ToastAndroid.SHORT);
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setCurrentCompany({ id:"", name: "", address: "", phone: "", email: "" });
  };

  // DELETE Handler
  const handleDelete = async (id) => {
    const result = await DeleteRealApi(`Company/${id}`, navigation);
    if (result) {
      ToastAndroid.show("🗑️ Şirket silindi!", ToastAndroid.SHORT);
      fetchCompanies();
    } else {
      ToastAndroid.show("❌ Silme başarısız.", ToastAndroid.SHORT);
    }
  };
  // CONFIRM before delete
const confirmDelete = (id) => {
  Alert.alert(
    "Silme Onayı",
    "Bu şirketi silmek istediğinize emin misiniz?",
    [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: () => handleDelete(id)
      }
    ]
  );
};

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.label}>Şirket İsmi</Text>
      <Text style={styles.value}>{item.name}</Text>

      <Text style={styles.label}>Adres</Text>
      <Text style={styles.value}>{item.address}</Text>

      <Text style={styles.label}>Telefon</Text>
      <Text style={styles.value}>{item.phone}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{item.email}</Text>

      <View style={styles.iconRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CompanyDetail", { id: item.id })}
          style={styles.iconButton}
        >
          <MaterialIcons name="info" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEditClick(item)}
          style={styles.iconButton}
        >
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.iconButton}>
    <MaterialIcons name="delete" size={24} color="red" />
  </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.fullPage}>
      {/* Arama + Butonlar */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrele..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => {/* TODO: İndir */}}
        >
          <Text style={styles.downloadBtnText}>İNDİR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.addBtnText}>EKLE</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Add Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleAddCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Şirket Ekle</Text>
            {["name", "address", "phone", "email"].map((key) => (
              <React.Fragment key={key}>
                <Text style={styles.label}>
                  {key === "name"
                    ? "Şirket İsmi"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <TextInput
                  style={styles.input}
                  value={newCompany[key]}
                  onChangeText={(t) => handleAddChange(key, t)}
                  keyboardType={key === "phone" ? "phone-pad" : key === "email" ? "email-address" : "default"}
                />
              </React.Fragment>
            ))}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleAddCancel}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddSubmit}
              >
                <Text style={styles.modalButtonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleEditCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şirketi Düzenle</Text>
            {["name", "address", "phone", "email"].map((key) => (
              <React.Fragment key={key}>
                <Text style={styles.label}>
                  {key === "name"
                    ? "Şirket İsmi"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <TextInput
                  style={styles.input}
                  value={currentCompany[key]}
                  onChangeText={(t) => handleEditChange(key, t)}
                  keyboardType={key === "phone" ? "phone-pad" : key === "email" ? "email-address" : "default"}
                />
              </React.Fragment>
            ))}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleEditCancel}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleEditSubmit}
              >
                <Text style={styles.modalButtonText}>Güncelle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.footer}>
        Copyright © 2025{" "}
        <Text style={{ fontWeight: "bold" }}>Imo.Cv.</Text> Tüm hakları saklıdır
      </Text>
    </View>
  );
};

export default CompaniesScreen;

// ... Styles aynı kaldı ...


const styles = StyleSheet.create({
  fullPage: { flex: 1, backgroundColor: "#f5faff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "#fff" },
  searchInput: { flex: 1, backgroundColor: "#d1d5db", padding: 8, borderRadius: 8, marginRight: 8 },
  downloadBtn: { backgroundColor: "#3b82f6", padding: 10, borderRadius: 8, marginRight: 8 },
  downloadBtnText: { color: "white", fontWeight: "bold" },
  addBtn: { backgroundColor: "#10B981", padding: 10, borderRadius: 8 },
  addBtnText: { color: "white", fontWeight: "bold" },
  listContainer: { padding: 8, paddingBottom: 64 },
  cardContainer: { backgroundColor: "#fff", marginVertical: 6, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb", elevation: 2 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginTop: 8 },
  value: { fontSize: 14, color: "#1f2937", marginBottom: 4 },
  iconRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  iconButton: { marginLeft: 12 },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 16 },
  modalContent: { backgroundColor: "#fff", borderRadius: 8, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, color: "#1E3A8A", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 8 },
  modalButtonRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  cancelButton: { backgroundColor: "#EF4444", padding: 10, borderRadius: 6, marginRight: 8 },
  submitButton: { backgroundColor: "#10B981", padding: 10, borderRadius: 6 },
  modalButtonText: { color: "#fff", fontWeight: "bold" },
  footer: { textAlign: "center", color: "#6b7280", padding: 16 },
});
