import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetRealApi, DeleteRealApi, PatchRealApi } from "../../../Components/ApiService"; 
import { checkTokenAndRedirect } from "../../../Components/utils";

const AdminAccounts = () => {
  const navigation = useNavigation();
  const [fetchedAdmins, setFetchedAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkTokenAndRedirect(navigation);
    fetchAdmins();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAdmins();
    }, [])
  );

  // API'den admin kullanıcıları çek
  const fetchAdmins = async () => {
    try {
      setIsRefreshing(true);
      const allRoles = await GetRealApi("User", navigation);
      if (!Array.isArray(allRoles)) {
        console.error("API beklenen formatta veri döndürmedi.");
        setFetchedAdmins([]);
        setFilteredAdmins([]);
        setIsRefreshing(false);
        return;
      }

      // role === "admin" olan nesneyi bul
      const adminRoleObj = allRoles.find((item) => item.role === "admin");
      if (adminRoleObj && Array.isArray(adminRoleObj.users)) {
        setFetchedAdmins(adminRoleObj.users);
        setFilteredAdmins(adminRoleObj.users);
      } else {
        setFetchedAdmins([]);
        setFilteredAdmins([]);
      }
    } catch (error) {
      console.error("Admin kullanıcılarını çekerken hata:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setFilteredAdmins(fetchedAdmins);
      return;
    }
    // userName veya email üzerinde arama yapabilirsiniz
    const filtered = fetchedAdmins.filter((admin) =>
      `${admin.userName} ${admin.email}`
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFilteredAdmins(filtered);
  };

  const handleRefresh = () => {
    fetchAdmins();
  };

  const handleDelete = async (adminId) => {
    if (!adminId) return;
    Alert.alert(
      "Silme Onayı",
      "Bu kullanıcıyı silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            const result = await DeleteRealApi(`User/${adminId}`, navigation);
            if (result) {
              alert("Kullanıcı başarıyla silindi.");
              fetchAdmins();
            } else {
              alert("Silme işlemi başarısız oldu.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Onay Durumu Değiştirme
  const handleApprovalToggle = async (user) => {
    try {
      const newStatus = !user.isApproved;
      const endpoint = `User?id=${user.id}&status=${newStatus}`;
      const updateResult = await PatchRealApi(endpoint, {}, navigation);

      if (updateResult) {
        // Başarılı ise listeyi tekrar çekerek ekranda güncel durumu göster
        fetchAdmins();
      } else {
        Alert.alert("Hata", "Onay durumu güncellenemedi.");
      }
    } catch (error) {
      console.error("Onay durumu değiştirilirken hata:", error);
      Alert.alert("Hata", "Onay durumu değiştirilemedi.");
    }
  };

  const renderAdminItem = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.label}>KULLANICI ADI:</Text>
        <Text style={styles.value}>{item.userName}</Text>

        <Text style={styles.label}>ADI SOYADI:</Text>
        <Text style={styles.value}>
          {item.firstName || "API de"} {item.lastName || "YOK"}
        </Text>

        <Text style={styles.label}>EMAIL:</Text>
        <Text style={styles.value}>{item.email}</Text>

        <Text style={styles.label}>ONAY DURUMU:</Text>
        <Text style={styles.value}>{item.isApproved ? "Onaylı" : "Onaysız"}</Text>

        <View style={styles.iconRow}>
          {/* Düzenleme Butonu */}
          <TouchableOpacity
            onPress={() => {
              console.log("Editing user with id:", item.id);
              // navigation.navigate("EditUser", { user: item });
            }}
            style={styles.iconButton}
          >
            <MaterialIcons name="edit" size={24} color="blue" />
          </TouchableOpacity>

          {/* Silme Butonu */}
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.iconButton}
          >
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>

          {/* Detay Butonu */}
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("UserDetail", { userId: item.id });
            }}
            style={styles.iconButton}
          >
            <MaterialIcons name="info" size={24} color="green" />
          </TouchableOpacity>

          {/* Onay Durumu Değiştirme Butonu */}
          <TouchableOpacity
            onPress={() => handleApprovalToggle(item)}
            style={styles.iconButton}
          >
            <MaterialIcons
              // Onaylı ise çarpı, onaysız ise tik ikonu
              name={item.isApproved ? "close" : "check"}
              size={24}
              // Onaylıysa kırmızı, onaysızsa yeşil
              color={item.isApproved ? "red" : "green"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Ara..."
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("AddUser");
          }}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAdmins}
        renderItem={renderAdminItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={<View style={{ marginBottom: 64 }} />}
      />
    </View>
  );
};

export default AdminAccounts;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#d1d5db",
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 4,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  iconButton: {
    marginLeft: 12,
  },
});
