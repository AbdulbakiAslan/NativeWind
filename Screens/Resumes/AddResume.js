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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as FileSystem from "expo-file-system";
import { PostRealApi } from "../../Components/ApiService";

export const AddResume = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Form alanlarımız. API şemasına göre bazı alan isimleri ve veri tipleri ayarlandı.
  const initialFormState = {
    registrationNumber: "", // sayısal değer gönderilecek
    firstName: "", // API 'name' olarak bekliyor
    lastName: "",
    gender: null, // sayı: 1 (Kadın) veya 2 (Erkek)
    phone: "",
    email: "",
    militaryStatus: null, // sayı: örneğin 1: Muaf, 2: Tecili, 3: Yapıldı, 4: Yapılıyor
    licenseClass: null, // sayı: 1,2,3,... (A, A1, A2, vs.)
    experience: null, // sayı: deneyim yılı (0, 1, 2, …)
    jobSeeking: null, // boolean: true/false
    address: "",
    district: "",
    province: "",
    notes: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [birthDate, setBirthDate] = useState(new Date());
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
      setBirthDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === "ios");
  };

  // Form gönderme işlemi: API’nin beklediği alan isimleri ve tiplerine göre verileri dönüştürüyoruz.
  const handleSubmit = async () => {
    setLoading(true);
    const photoBase64 = photoURI ? await convertToBase64(photoURI) : null;

    const dataToSend = {
      photoPath: photoBase64, // API 'photoPath' alanını bekliyor
      registrationNumber: Number(form.registrationNumber), // sayıya çeviriyoruz
      name: form.firstName, // 'firstName' alanını 'name' olarak gönderiyoruz
      lastName: form.lastName,
      birthDate: birthDate.toISOString(),
      gender: form.gender, // picker'dan alınan sayı değeri (1 veya 2)
      telephone: form.phone, // 'phone' alanını 'telephone' olarak gönderiyoruz
      email: form.email,
      address: form.address,
      district: form.district,
      province: form.province,
      militaryServiceStatus: form.militaryStatus, // sayı değeri
      driversLicenseClass: form.licenseClass, // sayı değeri
      experienceStatus: form.experience, // sayı değeri
      isLookingForJob: form.jobSeeking, // boolean
      isAnsweredLookingForJobMail: false, // Varsayılan değer (örneğin false)
      notes: form.notes,
    };

    console.log("Gönderilecek veri:", dataToSend);

    try {
      const result = await PostRealApi("Resume", dataToSend, navigation);
      if (result) {
        alert("Özgeçmiş başarıyla oluşturuldu.");
        // Form sıfırlama işlemi
        setForm(initialFormState);
        setBirthDate(new Date());
        setPhotoURI(null);
        // Başarılı kayıttan sonra ResumesScreen'e yönlendiriyoruz:
        navigation.navigate("Resumes");
      } else {
        alert("Özgeçmiş oluşturulurken hata oluştu.");
      }
    } catch (error) {
      console.error("Submit hatası:", error);
      alert("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Seçenekler: Picker'larda API'nin beklediği veri tiplerine uygun sayısal ve boolean değerler kullanıyoruz.
  const genderOptions = [
    { label: "Cinsiyet Seçin", value: null },
    { label: "Kadın", value: 1 },
    { label: "Erkek", value: 2 },
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

  const jobSeekingOptions = [
    { label: "İş Arıyor mu?", value: null },
    { label: "Evet", value: true },
    { label: "Hayır", value: false },
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
          <Text style={styles.title}>Yeni Özgeçmiş Ekle</Text>

          <TextInput
            placeholder="Oda Sicil Numarası"
            value={form.registrationNumber}
            onChangeText={(text) => handleChange("registrationNumber", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="İsim"
            value={form.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Soyisim"
            value={form.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{birthDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Picker
            selectedValue={form.gender}
            onValueChange={(v) => handleChange("gender", v)}
            style={styles.picker}
          >
            {genderOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          <TextInput
            placeholder="Telefon"
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
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

          <Picker
            selectedValue={form.militaryStatus}
            onValueChange={(v) => handleChange("militaryStatus", v)}
            style={styles.picker}
          >
            {militaryOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={form.licenseClass}
            onValueChange={(v) => handleChange("licenseClass", v)}
            style={styles.picker}
          >
            {driversLicenseOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={form.experience}
            onValueChange={(v) => handleChange("experience", v)}
            style={styles.picker}
          >
            {experienceOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={form.jobSeeking}
            onValueChange={(v) => handleChange("jobSeeking", v)}
            style={styles.picker}
          >
            {jobSeekingOptions.map((option) => (
              <Picker.Item
                key={option.value}
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
          <TextInput
            placeholder="Notlar"
            value={form.notes}
            onChangeText={(text) => handleChange("notes", text)}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>✔ Özgeçmiş Ekle</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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

export default AddResume;
