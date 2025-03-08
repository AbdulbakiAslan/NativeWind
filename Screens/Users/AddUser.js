import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PostRealApi } from "../../Components/ApiService";

const AddUser = () => {
  const navigation = useNavigation();

  // Form alanları: Swagger dokümanındaki alan isimlerine uygun
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveUser = async () => {
    // Şifre kontrolü
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor!");
      return;
    }

    // Swagger'a uygun gövde
    const newUser = {
      name,      // Ad
      lastName,  // Soyad
      userName,  // Kullanıcı Adı
      email,     // E-posta
      password,  // Şifre
    };

    // POST isteği: PostRealApi fonksiyonu ile gönderiyoruz.
    const result = await PostRealApi("User", newUser, navigation);
    
    if (result) {
      Alert.alert("Başarılı", "Kullanıcı başarıyla eklendi!");
      navigation.goBack();
    } else {
      Alert.alert("Hata", "Kullanıcı eklenirken hata oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Oluştur</Text>

      <Text style={styles.label}>Ad</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ad"
      />

      <Text style={styles.label}>Soyad</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Soyad"
      />

      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="Kullanıcı Adı"
      />

      <Text style={styles.label}>E-posta</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-posta"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Şifre</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Şifre"
        secureTextEntry
      />

      <Text style={styles.label}>Şifre Tekrar</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Şifre Tekrar"
        secureTextEntry
      />

      <Button title="Kaydet" onPress={handleSaveUser} />

      <Text style={styles.warningText}>
        Dikkat! Bu sayfa ile sadece “Yönetici” rolüne sahip kullanıcı oluşturulabilir.
        Oluşturulan kullanıcı tüm Yönetici yetkilerine sahip olacaktır.
      </Text>
    </View>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  warningText: {
    marginTop: 20,
    color: "red",
    fontWeight: "bold",
  },
});
