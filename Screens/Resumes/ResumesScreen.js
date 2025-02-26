import React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetRealApi, DeleteRealApi } from "../../Components/ApiService";
import { checkTokenAndRedirect } from "../../Components/utils";

export const ResumesScreen = () => {
  const nav = useNavigation();
  const [fetchedResumes, setFetchedResumes] = React.useState([]);
  const [filteredResumes, setFilteredResumes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  React.useEffect(() => {
    checkTokenAndRedirect(nav);
    fetchResumes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchResumes();
    }, [])
  );

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const realResumes = await GetRealApi("Resume", nav);
      if (realResumes === null) return;

      if (!Array.isArray(realResumes)) {
        console.error("API beklenen formatta veri döndürmedi.");
        setFetchedResumes([]);
        setFilteredResumes([]);
        return;
      }

      setFetchedResumes(realResumes);
      setFilteredResumes(realResumes);
    } catch (error) {
      console.error("Özgeçmişleri çekerken hata:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchResumes();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setFilteredResumes(fetchedResumes);
      return;
    }
    const filtered = fetchedResumes.filter((item) =>
      `${item.name} ${item.lastName} ${item.email}`
        .toLowerCase()
        .includes(text.toLowerCase())
    );
    setFilteredResumes(filtered);
  };

  const handleDelete = async (resumeId) => {
    if (!resumeId) return;
    Alert.alert(
      "Silme Onayı",
      "Bu kaydı silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            const result = await DeleteRealApi(`Resume/${resumeId}`, nav);
            if (result) {
              alert("Kayıt başarıyla silindi.");
              fetchResumes();
            } else {
              alert("Silme işlemi başarısız oldu.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderResumeItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.name} {item.lastName}
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280" }}>{item.email}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Düzenleme Butonu*/}
          <TouchableOpacity
            onPress={() => {
              console.log("Editing resume with id:", item.id);
              nav.navigate("EditResume", { resume: item });
            }}
          >
            <MaterialIcons name="edit" size={24} color="blue" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => nav.navigate("ResumeDetail", { resumeId: item.id })}
          >
            <MaterialIcons name="info" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Arama ve Ekle Butonu */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Ara..."
          style={{
            flex: 1,
            backgroundColor: "#d1d5db",
            padding: 8,
            borderRadius: 8,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#3b82f6",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          onPress={() => nav.navigate("AddResume")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={filteredResumes}
        renderItem={renderResumeItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={<View style={{ marginBottom: 64 }} />}
      />
    </View>
  );
};
