import * as React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ResumeItem } from "./ResumeItem";
import { useNavigation } from "@react-navigation/native";
import { GetRealApi } from "../../Components/ApiService"; // Gerçek API
import { checkTokenAndRedirect } from "../../Components/utils"; // 📌 Token kontrolünü ekledik

export const ResumesScreen = () => {
  const nav = useNavigation();
  const [fetchedResumes, setFetchedResumes] = React.useState([]);
  const [filteredResumes, setFilteredResumes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  // 📌 **Sayfa açıldığında önce token kontrolü yap**
  React.useEffect(() => {
    checkTokenAndRedirect(nav);
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      console.log("📡 API isteği gönderiliyor: /api/Resume");

      const realResumes = await GetRealApi("Resume", nav);
      if (realResumes === null) {
        return;
      }

      if (!Array.isArray(realResumes)) {
        console.error("❌ API beklenen formatta veri döndürmedi.");
        setFetchedResumes([]);
        setFilteredResumes([]);
        return;
      }

      console.log("✅ API'den Gelen Özgeçmişler:", realResumes);
      setFetchedResumes(realResumes);
      setFilteredResumes(realResumes);
    } catch (error) {
      console.error("❌ Özgeçmişleri çekerken hata:", error);
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

  return (
    <View>
      <View className="flex-row items-center w-full px-2 gap-2">
        <TextInput
          value={searchText}
          onChangeText={handleSearch}
          className="bg-gray-300 p-2 rounded-md flex-1"
          placeholder="Ara..."
        />

        {/* 📌 Ekleme Butonu - Herkes için aktif hale getirildi */}
        <TouchableOpacity
          className="bg-blue-500 items-center justify-center px-4 py-2 rounded-md"
          onPress={() => nav.navigate("AddResume")}
        >
          <Text className="text-white font-bold">Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredResumes}
        renderItem={({ item }) => <ResumeItem resume={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={() => <View className="mb-8" />}
      />
    </View>
  );
};
