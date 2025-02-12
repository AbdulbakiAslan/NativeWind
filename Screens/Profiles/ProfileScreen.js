import * as React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GetApi } from "../../Components/Data";
import { UserItem } from "./UserItem";
import { useNavigation } from "@react-navigation/native";
import { checkTokenAndRedirect } from "../../Components/utils"; // Token kontrolünü ekledik

export const ProfileScreen = () => {
  const nav = useNavigation();
  const [fetchedUsers, setFetchedUsers] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");

  // 📌 **Sayfa açıldığında önce token kontrolü yap**
  React.useEffect(() => {
    checkTokenAndRedirect(nav);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await GetApi("users");
      setFetchedUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    let filtered = [];

    if (text) {
      filtered = fetchedUsers.filter((item) => {
        const firstName = item?.firstName?.toLowerCase() || "";
        const lastName = item?.lastName?.toLowerCase() || "";
        const email = item?.email?.toLowerCase() || "";
        const phone = item?.phone?.toLowerCase() || "";
        const role = item?.role?.toLowerCase() || "";

        return (
          firstName.includes(text.toLowerCase()) ||
          lastName.includes(text.toLowerCase()) ||
          email.includes(text.toLowerCase()) ||
          phone.includes(text.toLowerCase()) ||
          role.includes(text.toLowerCase())
        );
      });
    } else {
      filtered = fetchedUsers;
    }

    setFilteredUsers(filtered);
  };

  return (
    <View>
      <View className="flex-row items-center w-full px-2 gap-2">
        <TextInput
          value={searchText}
          onChangeText={(text) => handleSearch(text)}
          className="bg-red-500 text-white p-2 rounded-md flex-1"
          placeholder="Ara..."
        />

        <TouchableOpacity
          className="bg-black items-center justify-center px-4 py-2 rounded-md"
          onPress={() => nav.navigate("AddProfile")}
        >
          <Text className="text-white">Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => <UserItem user={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e) => e.id.toString()}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={() => <View className="mb-8" />}
      />
    </View>
  );
};
