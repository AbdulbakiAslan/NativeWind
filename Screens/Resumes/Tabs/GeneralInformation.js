import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GetRealApi, PutRealApi } from "../../../Components/ApiService";

const GeneralInformation = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // route.params içinde "resumeId" veya "resume" gelebilir.
  const { resume, resumeId } = route.params;

  // API'den çekilen veya doğrudan gelen veriyi tutacak state
  const [resumeData, setResumeData] = useState(resume || null);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    if (!resumeData && resumeId) {
      async function fetchResumeById() {
        const result = await GetRealApi(`Resume/${resumeId}`, navigation);
        setResumeData(result);
      }
      fetchResumeById();
    }
  }, [resumeData, resumeId]);

  const fetchResumeById = async (id) => {
    setLoadingResume(true);
    try {
      // Tekil kayıt: GET /api/Resume/{id}
      const result = await GetRealApi(`Resume/${id}`, navigation);
      console.log("Tekil resume:", result);
      if (result) {
        setResumeData(result);
      }
    } catch (error) {
      console.error("Resume çekme hatası:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  if (loadingResume || !resumeData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Formu doldurmak için başlangıç verileri
  const initialFormState = {
    registrationNumber: resumeData.registrationNumber?.toString() || "",
    firstName: resumeData.name || "",
    lastName: resumeData.lastName || "",
    gender: resumeData.gender || null,
    phone: resumeData.telephone || "",
    email: resumeData.email || "",
    militaryStatus: resumeData.militaryServiceStatus || null,
    licenseClass: resumeData.driversLicenseClass || null,
    experience: resumeData.experienceStatus || null,
    jobSeeking: resumeData.isLookingForJob || false,
    address: resumeData.address || "",
    district: resumeData.district || "",
    province: resumeData.province || "",
    notes: resumeData.notes || "",
  };

  // Form state
  const [form, setForm] = useState(initialFormState);

  // Tarih seçimi için ek state'ler
  const [birthDate, setBirthDate] = useState(
    resumeData.birthDate ? new Date(resumeData.birthDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Yeni fotoğraf seçilirse saklayacağımız URI
  const [photoURI, setPhotoURI] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form alanı değişimlerinde çalışan fonksiyon
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Resmi base64'e çeviren fonksiyon
  const convertToBase64 = async (uri) => {
    try {
      return await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error("Resim dönüştürme hatası:", error);
      return null;
    }
  };

  // Galeriden resim seçme
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

  // DateTimePicker'da tarih seçimi
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
    // iOS'ta picker açık kalmasın
    setShowDatePicker(Platform.OS === "ios");
  };

  // PUT isteği ile güncelleme
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const photoBase64 = photoURI
        ? await convertToBase64(photoURI)
        : resumeData.photoPath || null;

      // birthDate ve notes alanlarını ekliyoruz
      const dataToSend = {
        id: resumeData.id,
        photoPath: photoBase64,
        registrationNumber: Number(form.registrationNumber),
        name: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        telephone: form.phone,
        email: form.email,
        address: form.address,
        district: form.district,
        province: form.province,
        militaryServiceStatus: form.militaryStatus,
        driversLicenseClass: form.licenseClass,
        experienceStatus: form.experience,
        isLookingForJob: form.jobSeeking,
        // Eklediğimiz alanlar
        birthDate: birthDate.toISOString(),
        notes: form.notes,
      };

      console.log("PUT Gönderilen veri:", dataToSend);
      // PUT /api/Resume
      const result = await PutRealApi("Resume", dataToSend, navigation);

      // API 204 döndüğünde result {} veya null olabilir. Başarılı sayabiliriz.
      if (result !== null) {
        alert("Özgeçmiş başarıyla güncellendi.");
        navigation.navigate("Resumes");
      } else {
        alert("Özgeçmiş güncellenirken hata oluştu veya yanıt boş döndü.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Picker verileri (örnek)
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
    { label: "Deneyim Seçin", value: null },
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
    { label: "İş Arıyor mu?", value: false },
    { label: "Evet", value: true },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerText}>📷 Fotoğraf Seç</Text>
      </TouchableOpacity>
      {photoURI ? (
        <Image source={{ uri: photoURI }} style={styles.imagePreview} />
      ) : resumeData.photoPath ? (
        <Image
          source={{ uri: `data:image/png;base64,${resumeData.photoPath}` }}
          style={styles.imagePreview}
        />
      ) : null}

      <View style={styles.formContainer}>
        <Text style={styles.title}>Özgeçmiş Düzenle</Text>

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

        {/* Doğum Tarihi Seçimi */}
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>Doğum Tarihi: {birthDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
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
          {genderOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>

        {/* Telefon */}
        <TextInput
          placeholder="Telefon"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
          style={styles.input}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          style={styles.input}
        />

        {/* Askerlik Durumu */}
        <Picker
          selectedValue={form.militaryStatus}
          onValueChange={(v) => handleChange("militaryStatus", v)}
          style={styles.picker}
        >
          {militaryOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>

        {/* Sürücü Belgesi */}
        <Picker
          selectedValue={form.licenseClass}
          onValueChange={(v) => handleChange("licenseClass", v)}
          style={styles.picker}
        >
          {driversLicenseOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>

        {/* Deneyim */}
        <Picker
          selectedValue={form.experience}
          onValueChange={(v) => handleChange("experience", v)}
          style={styles.picker}
        >
          {experienceOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>

        {/* İş Arıyor mu? */}
        <Picker
          selectedValue={form.jobSeeking}
          onValueChange={(v) => handleChange("jobSeeking", v)}
          style={styles.picker}
        >
          {jobSeekingOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>

        {/* Adres */}
        <TextInput
          placeholder="Adres"
          value={form.address}
          onChangeText={(text) => handleChange("address", text)}
          style={styles.input}
        />

        {/* İlçe */}
        <TextInput
          placeholder="İlçe"
          value={form.district}
          onChangeText={(text) => handleChange("district", text)}
          style={styles.input}
        />

        {/* İl */}
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
          style={[styles.input, { height: 80 }]}
          multiline
        />

        {/* Güncelle Butonu */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Güncelle</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default GeneralInformation;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    alignSelf: "center",
    marginBottom: 16,
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
