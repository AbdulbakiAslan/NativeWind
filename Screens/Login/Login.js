// Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PostRealApi } from "../../Components/ApiService";

export const Login = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // API çağrısı ve token işlemleri, navigation parametresi de ekleniyor.
      const response = await PostRealApi(
        "Authentication/CreateTokenForUser",
        { email, password },
        navigation
      );

      if (!response) {
        Alert.alert("Hata", "Sunucudan yanıt alınamadı.");
        return;
      }

      // Sunucudan "User is Not Approved" mesajı geliyorsa:
      if (response.title === "User is Not Approved") {
        Alert.alert(
          "Hesabınız Onaylanmadı",
          "Henüz hesabınız onaylanmadı. Lütfen onay sürecini bekleyin."
        );
        return;
      }

      // Eğer hem access token hem de refresh token geldiyse
      if (response.accessToken && response.refreshToken) {
        await AsyncStorage.setItem("userToken", response.accessToken);
        await AsyncStorage.setItem("refreshToken", response.refreshToken);
        setIsLoggedIn(true);
        console.log(
          "Access ve Refresh Token başarıyla kaydedildi:",
          response.accessToken
        );
      } else if (response.accessToken) {
        // Sadece access token mevcutsa onu kaydet
        await AsyncStorage.setItem("userToken", response.accessToken);
        setIsLoggedIn(true);
        console.log("Sadece Access Token kaydedildi:", response.accessToken);
      } else {
        Alert.alert(
          "Giriş Başarısız",
          response.message || "Hatalı e-posta veya şifre."
        );
      }
    } catch (error) {
      console.log("Giriş sırasında hata:", error);
      Alert.alert("Hata", "Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Giriş Yap</Text>
        <Text style={styles.subtitle}>
          Giriş yapmak için kullanıcı adınızı ve şifrenizi girin
        </Text>

        <TextInput
          placeholder="Kullanıcı Adı / E-posta"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Şifre"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpMember")}>
            <Text style={styles.signUpText}>Üye Hesabı</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}> veya </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpCompany")}>
            <Text style={styles.signUpText}>Şirket Hesabı</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}> oluşturun</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    width: "85%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
  signUpText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
