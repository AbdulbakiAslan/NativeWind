import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  Button,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { GetApi } from "../../Components/Data";
import { Item } from "../../Components/Item";
import { useNavigation } from "@react-navigation/native";

export const ProfileDetail = ({ route }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, [route.params.profileId]);

  const fetchProfile = async () => {
    try {
      setProfile(null); // Önceki veriyi temizle
      setLoading(true);
      const data = await GetApi(`users/${route?.params?.profileId}`);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View className="flex-1">
      <ScrollView className="flex-grow px-4">
        {/* Profil Resmi */}
        <View className="items-center mt-4 mb-4">
          <Image
            style={{ width: 150, height: 150, borderRadius: 75 }}
            source={{ uri: profile?.image }}
          />
        </View>

        {/* Kullanıcı Bilgileri */}
        <Item
          label={"Adı Soyadı:"}
          text={`${profile?.firstName} ${profile?.lastName}`}
        />
        <Item label={"Mail Adresi:"} text={profile?.email} />
        <Item label={"Telefon Numarası:"} text={profile?.phone} />
        <Item label={"Doğum Tarihi:"} text={profile?.birthDate} />
        <Item label={"Rolü:"} text={profile?.role} />
      </ScrollView>

      {/* Geri Butonu - En Alta Sabit */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          className="bg-red-500 w-full py-3 rounded-lg items-center"
        >
          <Text className="text-white text-lg font-bold">Geri</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
