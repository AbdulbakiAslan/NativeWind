import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PostRealApi } from "../../Components/ApiService";

const AddUser = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveUser = async () => {
    // Şifre kontrolü
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor!");
      return;
    }

    const newUser = {
      name,
      email,
      surname,
      password,
    };

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
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Kullanıcı Adı"
      />

      <Text style={styles.label}>Eposta</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Eposta"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Soyadı</Text>
      <TextInput
        style={styles.input}
        value={surname}
        onChangeText={setSurname}
        placeholder="Soyadı"
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
});
