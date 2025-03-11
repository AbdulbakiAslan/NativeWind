// AddUser.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostRealApi } from '../../Components/ApiService';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddUser = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveUser = async () => {
    // Şifre uzunluğu kontrolü (en az 6 karakter)
    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır!");
      return;
    }

    // Şifre regex kontrolü: en az bir büyük harf, bir rakam, bir özel karakter
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Hata", 
        "Şifre, en az bir büyük harf, bir rakam ve bir özel karakter içermelidir!"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifre ve Şifre Tekrar alanları uyuşmuyor!");
      return;
    }

    const newUser = { name, lastName, userName, email, password };

    try {
      const result = await PostRealApi("User", newUser);
      if (result) {
        Alert.alert("Başarılı", "Kullanıcı başarıyla eklendi!");
        navigation.goBack();
      } else {
        Alert.alert("Hata", "Kullanıcı eklenirken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("handleSaveUser error:", error);
      Alert.alert("Hata", "Sunucuyla iletişim sırasında bir hata oluştu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Kullanıcı Oluştur</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ad</Text>
          <TextInput
            style={styles.input}
            placeholder="Adınız"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Soyad</Text>
          <TextInput
            style={styles.input}
            placeholder="Soyadınız"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Kullanıcı Adı"
            value={userName}
            onChangeText={setUserName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            placeholder="ornek@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            placeholder="En az 6 karakter, büyük harf, rakam, özel karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Şifre Tekrar</Text>
          <TextInput
            style={styles.input}
            placeholder="Şifre Tekrar"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveUser}>
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#007AFF"
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Şifre, en az 6 karakter uzunluğunda olup; bir büyük harf, bir rakam ve bir özel karakter içermelidir.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
  },
  container: {
    marginHorizontal: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef6ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    flexShrink: 1,
  },
});
