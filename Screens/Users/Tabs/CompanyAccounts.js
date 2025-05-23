import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl, Alert, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetRealApi, DeleteRealApi, PatchRealApi } from "../../../Components/ApiService";
import { checkTokenAndRedirect } from "../../../Components/utils";

const CompanyAccounts = () => {
  const navigation = useNavigation();
  const [fetchedCompanies, setFetchedCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkTokenAndRedirect(navigation);
    fetchCompanies();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCompanies();
    }, [])
  );

  const fetchCompanies = async () => {
    try {
      setIsRefreshing(true);
      const allRoles = await GetRealApi("User", navigation);
      if (!Array.isArray(allRoles)) {
        console.error("API beklenen formatta veri döndürmedi.");
        setFetchedCompanies([]);
        setFilteredCompanies([]);
        setIsRefreshing(false);
        return;
      }
      // "company" rolüne sahip kullanıcıları filtrele
      const companyRoleObj = allRoles.find((item) => item.role === "company");
      if (companyRoleObj && Array.isArray(companyRoleObj.users)) {
        setFetchedCompanies(companyRoleObj.users);
        setFilteredCompanies(companyRoleObj.users);
      } else {
        setFetchedCompanies([]);
        setFilteredCompanies([]);
      }
    } catch (error) {
      console.error("Şirket kullanıcılarını çekerken hata:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setFilteredCompanies(fetchedCompanies);
      return;
    }
    const filtered = fetchedCompanies.filter((company) =>
      `${company.userName} ${company.email}`.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  const handleRefresh = () => {
    fetchCompanies();
  };

  const handleDelete = async (companyId) => {
    if (!companyId) return;
    Alert.alert(
      "Silme Onayı",
      "Bu şirket kullanıcıyı silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            const result = await DeleteRealApi(`User/${companyId}`, navigation);
            if (result) {
              alert("Kullanıcı başarıyla silindi.");
              fetchCompanies();
            } else {
              alert("Silme işlemi başarısız oldu.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleApprovalToggle = async (user) => {
    try {
      const newStatus = !user.isApproved;
      const endpoint = `User?id=${user.id}&status=${newStatus}`;
      const updateResult = await PatchRealApi(endpoint, {}, navigation);

      if (updateResult) {
        fetchCompanies();
      } else {
        Alert.alert("Hata", "Onay durumu güncellenemedi.");
      }
    } catch (error) {
      console.error("Onay durumu değiştirilirken hata:", error);
      Alert.alert("Hata", "Onay durumu değiştirilemedi.");
    }
  };

  const renderCompanyItem = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.label}>KULLANICI ADI:</Text>
        <Text style={styles.value}>{item.userName}</Text>

        <Text style={styles.label}>ADI SOYADI:</Text>
        <Text style={styles.value}>
          {item.firstName || ""} {item.lastName || ""}
        </Text>

        <Text style={styles.label}>EMAIL:</Text>
        <Text style={styles.value}>{item.email}</Text>

        <Text style={styles.label}>ONAY DURUMU:</Text>
        <Text style={styles.value}>
          {item.isApproved ? "Onaylı" : "Onaysız"}
        </Text>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => {
              console.log("Editing company user with id:", item.id);
              // navigation.navigate("EditUser", { user: item });
            }}
            style={styles.iconButton}
          >
            <MaterialIcons name="edit" size={20} color="blue" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.iconButton}
          >
            <MaterialIcons name="delete" size={20} color="red" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("UserDetail", { userId: item.id });
            }}
            style={styles.iconButton}
          >
            <MaterialIcons name="info" size={20} color="green" />
          </TouchableOpacity>

          {/* Onay Durumu Değiştirme Butonu */}
          <TouchableOpacity
            onPress={() => handleApprovalToggle(item)}
            style={styles.iconButton}
          >
            <MaterialIcons
              name={item.isApproved ? "close" : "check"}
              size={20}
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
            // navigation.navigate("AddCompany");
          }}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCompanies}
        renderItem={renderCompanyItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={<View style={{ marginBottom: 64 }} />}
      />
    </View>
  );
};

export default CompanyAccounts;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#d1d5db",
    padding: 6,
    borderRadius: 6,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    fontSize: 14,
    marginTop: 2,
  },
  value: {
    color: "#1f2937",
    marginBottom: 2,
    fontSize: 14,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  iconButton: {
    marginLeft: 10,
  },
});
