import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { PostRealApi } from "../../Components/ApiService";

const SignUpMember = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Kayıt butonuna basıldığında tetiklenecek fonksiyon
  const handleSignUp = async () => {
    // Tüm alanların doldurulup doldurulmadığını kontrol ediyoruz
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !userName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password.trim() ||
      !rePassword.trim()
    ) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurunuz.");
      return;
    }

    // Üyelik sözleşmesi onay kontrolü
    if (!termsAccepted) {
      Alert.alert("Uyarı", "Üyelik sözleşmesini kabul etmelisiniz.");
      return;
    }
    // Şifre validasyonu: en az 6 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermeli
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Hata",
        "Şifreniz en az 6 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir!"
      );
      return;
    }
    if (password !== rePassword) {
      Alert.alert("Uyarı", "Şifre ve Şifre Tekrar alanları eşleşmiyor!");
      return;
    }

    try {
      // /api/User/SignUpMember endpoint’ine servisinize uygun şekilde istek atıyoruz.
      const result = await PostRealApi(
        "User/SignUpMember",
        {
          name: firstName,
          lastName: lastName,
          userName: userName,
          phone: phone,
          email: email,
          password: password,
          rePassword: rePassword,
          checkTermsAndConditions: termsAccepted,
        },
        navigation
      );

      // API boş yanıt döndürse bile (kayıt gerçekleşmişse) başarı mesajı gösteriyoruz
      if (result || result === null) {
        Alert.alert("Başarılı", "Kayıt işlemi tamamlandı!");
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
        <Text style={styles.title}>Üye Hesabı Oluştur</Text>
        <Text style={styles.subtitle}>
          İMO Üyesi iseniz bu sayfadan hesap oluşturabilirsiniz
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Adı"
          value={firstName}
          onChangeText={setFirstName}
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
          value={userName}
          onChangeText={setUserName}
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
          value={rePassword}
          onChangeText={setRePassword}
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
          <Text style={styles.footerText}>İş ilanı mı vermek istiyorsunuz?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUpCompany")}>
            <Text style={styles.linkText}> Şirket Hesabı Oluşturun</Text>
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

export default SignUpMember;

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
