import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import { PostRealApi } from "../../Components/ApiService";

const AddMember = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Form başlangıç durumu
  const initialFormState = {
    registrationNumber: "",
    name: "",
    lastName: "",
    birthDate: new Date(), // Tarihi JS Date nesnesi olarak tutuyoruz
    gender: null,
    telephone: "",
    email: "",
    address: "",
    district: "",
    province: "",
    militaryServiceStatus: null,
    driversLicenseClass: null,
    experienceStatus: null,
    isLookingForJob: null,
    isAnsweredLookingForJobMail: null,
    notes: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoURI, setPhotoURI] = useState(null);

  // Form güncelleme fonksiyonu
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Resmi base64'e dönüştürme
  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Resim dönüştürme hatası:", error);
      return null;
    }
  };

  // Resim seçme fonksiyonu
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoURI(result.assets[0].uri);
    }
  };

  // Tarih seçici değişim fonksiyonu
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      handleChange("birthDate", selectedDate);
    }
    setShowDatePicker(Platform.OS === "ios");
  };

  // Form gönderme ve API'ye POST isteği yapma
  const handleSubmit = async () => {
    setLoading(true);

    // Seçilen resmi base64'e dönüştür
    const photoBase64 = photoURI ? await convertToBase64(photoURI) : null;

    // Gönderilecek veri: API endpoint'inizin beklediği JSON yapısı
    const dataToSend = {
      photoPath: photoBase64,
      registrationNumber: form.registrationNumber,
      name: form.name,
      lastName: form.lastName,
      birthDate: form.birthDate.toISOString(),
      gender: form.gender,
      telephone: form.telephone,
      email: form.email,
      address: form.address,
      district: form.district,
      province: form.province,
      militaryServiceStatus: form.militaryServiceStatus,
      driversLicenseClass: form.driversLicenseClass,
      experienceStatus: form.experienceStatus,
      isLookingForJob: form.isLookingForJob,
      isAnsweredLookingForJobMail: form.isAnsweredLookingForJobMail,
      notes: form.notes,
    };

    console.log("Gönderilecek veri:", dataToSend);

    // API POST çağrısı: POST /api/Resume/myResumeData
    const response = await PostRealApi("Resume/myResumeData", dataToSend, navigation);
    if (response) {
      Alert.alert("Başarılı", "Üye (Resume) başarıyla eklendi.");
      // Üye başarıyla oluşturulduktan sonra MemberDetail ekranına yönlendiriyoruz
      navigation.navigate("MemberDetail", { member: response });
    } else {
      Alert.alert("Hata", "Üye ekleme/güncelleme sırasında hata oluştu.");
    }

    // Formu sıfırlama
    setForm(initialFormState);
    setPhotoURI(null);
    setLoading(false);
  };

  // Picker seçenekleri (örnek)
  const genderOptions = [
    { label: "Cinsiyet Seçin", value: null },
    { label: "Kadın", value: 1 },
    { label: "Erkek", value: 2 },
  ];

  const boolOptions = [
    { label: "Seçiniz", value: null },
    { label: "Evet", value: true },
    { label: "Hayır", value: false },
  ];

  const militaryOptions = [
    { label: "Askerlik Durumu Seçin", value: null },
    { label: "Muaf", value: 1 },
    { label: "Tecili", value: 2 },
    { label: "Yapıldı", value: 3 },
    { label: "Yapılıyor", value: 4 },
  ];

  const driversLicenseOptions = [
    { label: "Sürücü Belgesi Seçin", value: null },
    { label: "A", value: 1 },
    { label: "A1", value: 2 },
    { label: "A2", value: 3 },
    { label: "B", value: 4 },
    { label: "B2", value: 5 },
    { label: "C", value: 6 },
    { label: "D", value: 7 },
    { label: "E", value: 8 },
  ];

  const experienceOptions = [
    { label: "Deneyim Durumu Seçin", value: null },
    { label: "Deneyimi Yok", value: 0 },
    { label: "1 Yıl", value: 1 },
    { label: "2 Yıl", value: 2 },
    { label: "3 Yıl", value: 3 },
    { label: "4 Yıl", value: 4 },
    { label: "5 Yıl", value: 5 },
    { label: "6 Yıl", value: 6 },
    { label: "7 Yıl", value: 7 },
    { label: "8 Yıl", value: 8 },
    { label: "9 Yıl", value: 9 },
    { label: "10 Yıl ve Üzeri", value: 10 },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          <Text style={styles.imagePickerText}>📷 Fotoğraf Seç</Text>
        </TouchableOpacity>
        {photoURI && (
          <Image source={{ uri: photoURI }} style={styles.imagePreview} />
        )}

        <View style={styles.formContainer}>
          <Text style={styles.title}>Yeni Üye / Özgeçmiş Ekle</Text>

          <TextInput
            placeholder="Oda Sicil Numarası"
            value={form.registrationNumber}
            onChangeText={(text) => handleChange("registrationNumber", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="İsim"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Soyisim"
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            style={styles.input}
          />

          {/* Doğum Tarihi */}
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{form.birthDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.birthDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Cinsiyet */}
          <Picker
            selectedValue={form.gender}
            onValueChange={(v) => handleChange("gender", v)}
            style={styles.picker}
          >
            {genderOptions.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          <TextInput
            placeholder="Telefon"
            value={form.telephone}
            onChangeText={(text) => handleChange("telephone", text)}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            style={styles.input}
            keyboardType="email-address"
          />

          {/* Askerlik Durumu */}
          <Picker
            selectedValue={form.militaryServiceStatus}
            onValueChange={(v) => handleChange("militaryServiceStatus", v)}
            style={styles.picker}
          >
            {militaryOptions.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          {/* Sürücü Belgesi */}
          <Picker
            selectedValue={form.driversLicenseClass}
            onValueChange={(v) => handleChange("driversLicenseClass", v)}
            style={styles.picker}
          >
            {driversLicenseOptions.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          {/* Deneyim */}
          <Picker
            selectedValue={form.experienceStatus}
            onValueChange={(v) => handleChange("experienceStatus", v)}
            style={styles.picker}
          >
            {experienceOptions.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          {/* İş Arıyor mu? */}
          <Picker
            selectedValue={form.isLookingForJob}
            onValueChange={(v) => handleChange("isLookingForJob", v)}
            style={styles.picker}
          >
            {boolOptions.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          {/* İş Arama Mailine Cevap Verildi mi? */}
          <Picker
            selectedValue={form.isAnsweredLookingForJobMail}
            onValueChange={(v) => handleChange("isAnsweredLookingForJobMail", v)}
            style={styles.picker}
          >
            {boolOptions.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          <TextInput
            placeholder="Adres"
            value={form.address}
            onChangeText={(text) => handleChange("address", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="İlçe"
            value={form.district}
            onChangeText={(text) => handleChange("district", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="İl"
            value={form.province}
            onChangeText={(text) => handleChange("province", text)}
            style={styles.input}
          />

          {/* Notlar */}
          <TextInput
            placeholder="Notlar"
            value={form.notes}
            onChangeText={(text) => handleChange("notes", text)}
            style={styles.input}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>✔ Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16 },
  imagePickerButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  imagePickerText: { color: "#fff", fontWeight: "bold" },
  imagePreview: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
