import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PostApi } from "../../Components/Data";

export const AddProfile = () => {
  const nav = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const postData = async () => {
    setLoading(true);

    const sendData = {
      username,
      email,
      firstName,
      lastName,
      password,
    };

    console.log("Gönderilen veri:", sendData);

    try {
      const result = await PostApi("users/add", sendData);
      console.log("API Yanıtı:", result);

      if (result?.id) {
        alert("Kullanıcı başarıyla eklendi!");
        nav.navigate("Profile");
      } else {
        alert("Kullanıcı eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("API Hatası: Kullanıcı eklenemedi.");
    }

    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View className="p-4">
      {/* Kullanıcı Bilgileri Girişi */}
      <View className="mb-4">
        <Text className="font-bold mb-1">Kullanıcı Adı</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md"
          value={username}
          onChangeText={setUsername}
          placeholder="Kullanıcı adınızı girin"
        />
      </View>

      <View className="mb-4">
        <Text className="font-bold mb-1">Eposta</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md"
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta adresinizi girin"
          keyboardType="email-address"
        />
      </View>

      <View className="mb-4">
        <Text className="font-bold mb-1">Adı</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Adınızı girin"
        />
      </View>

      <View className="mb-4">
        <Text className="font-bold mb-1">Soyadı</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Soyadınızı girin"
        />
      </View>

      <View className="mb-6">
        <Text className="font-bold mb-1">Şifre</Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md"
          value={password}
          onChangeText={setPassword}
          placeholder="Şifrenizi girin"
          secureTextEntry
        />
      </View>

      {/* Butonlar */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => nav.navigate("Profile")}
          className="w-1/2 bg-red-500 p-3 rounded-lg items-center"
        >
          <Text className="text-white font-bold">Vazgeç</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={postData}
          className="w-1/2 bg-green-500 p-3 rounded-lg items-center"
        >
          <Text className="text-white font-bold">Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Bilgilendirme */}
      <View className="mt-6">
        <Text className="text-center text-red-600">
          Bu sayfa ile sadece "Yönetici" rolüne sahip kullanıcı oluşturulabilir.
          Oluşturulan kullanıcı tüm Yönetici yetkilerine sahip olacaktır.
        </Text>
      </View>
    </View>
  );
};
