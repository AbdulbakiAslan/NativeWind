import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { PostRealApi } from "../../Components/ApiService";

const SignUpCompany = ({ navigation }) => {
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [name, setName] = useState("");               
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = async () => {
    if (
      !companyName.trim() ||
      !companyAddress.trim() ||
      !name.trim() ||                
      !lastName.trim() ||
      !username.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurunuz.");
      return;
    }

    if (!termsAccepted) {
      Alert.alert("Uyarı", "Üyelik sözleşmesini kabul etmelisiniz.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Hata",
        "Şifreniz en az 6 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir!"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Uyarı", "Şifreler eşleşmiyor!");
      return;
    }

    try {
      const result = await PostRealApi(
        "User/SignUpCompany",
        {
          companyName: companyName,
          companyAddress: companyAddress,
          name: name,                   
          lastName: lastName,
          userName: username,           
          phone: phone,
          email: email,
          password: password,
          rePassword: confirmPassword,  
          checkTermsAndConditions: termsAccepted,  
        },
        navigation
      );

      if (result || result === null) {
        Alert.alert("Başarılı", "Şirket hesabı oluşturuldu!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Hata", "Kayıt sırasında bir hata oluştu.");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuyla iletişim sırasında bir hata oluştu.");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Şirket Hesabı Oluştur</Text>
        <Text style={styles.subtitle}>
          Şirketinizde Mühendis istihdam etmek istiyorsanız bu sayfadan hesap oluşturabilirsiniz
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Şirket Adı"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Şirket Adresi"
          value={companyAddress}
          onChangeText={setCompanyAddress}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Adı"
          value={name}               
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Soyadı"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre Tekrar"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.termsContainer}>
          <CheckBox
            checked={termsAccepted}
            onPress={() => setTermsAccepted(!termsAccepted)}
            containerStyle={styles.checkbox}
          />
          <Text style={styles.termsText}>
            Üyelik Sözleşmesini okudum ve kabul ediyorum
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
          <Text style={styles.createButtonText}>Oluştur</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Özgeçmiş mi oluşturacaksınız?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpMember")}>
            <Text style={styles.linkText}> Üye Hesabı Oluşturun</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabınız var mı?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}> Giriş Yapın</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpCompany;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    paddingVertical: 30,
  },
  formContainer: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
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
    backgroundColor: "#FFF",
  },
  multiline: {
    height: 80,
    textAlignVertical: "top",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginLeft: 0,
    paddingLeft: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#333",
  },
  linkText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
