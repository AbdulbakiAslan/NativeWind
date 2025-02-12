// Login.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostRealApi } from "../../Components/ApiService";

export const Login = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // API çağrısı ve token işlemleri
      const response = await PostRealApi("Authentication/CreateTokenForUser", {
        email,
        password,
      });

      if (!response) {
        Alert.alert("Hata", "Sunucudan yanıt alınamadı.");
        return;
      }

      if (response.accessToken) {
        await AsyncStorage.setItem("userToken", response.accessToken);
        setIsLoggedIn(true); // Giriş başarılıysa global state güncelleniyor.
        console.log("Token başarıyla kaydedildi:", response.accessToken);
        // Giriş yapıldığında MyDrawer ekranı görüntülenecek.
      } else {
        Alert.alert(
          "Giriş Başarısız",
          response.message || "Hatalı email veya şifre."
        );
      }
    } catch (error) {
      console.log("Giriş sırasında hata:", error);
      Alert.alert("Hata", "Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Giriş Yap</Text>
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, width: 200, marginVertical: 5, padding: 8 }}
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, width: 200, marginVertical: 5, padding: 8 }}
      />
      <Button title="Giriş Yap" onPress={handleLogin} />
    </View>
  );
};
