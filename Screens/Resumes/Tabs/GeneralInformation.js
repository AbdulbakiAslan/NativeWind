import React, { useEffect, useState } from "react";
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
import { GetRealApi, PutRealApi } from "../../../Components/ApiService";

const GeneralInformation = (props) => {
  const { resume } = props;
  const navigation = useNavigation();

  const effectiveResumeId = resume?.id;
  console.log("Using resumeId:", effectiveResumeId);

  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  const [form, setForm] = useState({});
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photoURI, setPhotoURI] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (effectiveResumeId) {
      fetchResume(effectiveResumeId);
    }
  }, [effectiveResumeId]);

  const fetchResume = async (id) => {
    try {
      setLoadingResume(true);
      const result = await GetRealApi(`Resume/${id}`, navigation);
      console.log("Fetched resume data:", result);
      if (result) {
        if (Array.isArray(result)) {
          setResumeData(result[0]);
          console.log("Using first element from array:", result[0]);
        } else {
          setResumeData(result);
        }
      } else {
        console.warn("API'den boş sonuç döndü.");
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  useEffect(() => {
    if (resumeData) {
      console.log("resumeData state güncellendi:", resumeData);
      setForm({
        registrationNumber: resumeData.registrationNumber
          ? String(resumeData.registrationNumber)
          : "",
        firstName: resumeData.name || "",
        lastName: resumeData.lastName || "",
        gender: resumeData.gender || null,
        phone: resumeData.telephone || "",
        email: resumeData.email || "",
        militaryStatus: resumeData.militaryServiceStatus || null,
        licenseClass: resumeData.driversLicenseClass || null,
        experience: resumeData.experienceStatus || null,
        jobSeeking: resumeData.isLookingForJob || null,
        address: resumeData.address || "",
        district: resumeData.district || "",
        province: resumeData.province || "",
        notes: resumeData.notes || "",
      });
      if (resumeData.birthDate) {
        setBirthDate(new Date(resumeData.birthDate));
      }
      setPhotoURI(null);
    }
  }, [resumeData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Fotoğraf seçme fonksiyonu
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      console.log("Seçilen fotoğraf URI:", result.assets[0].uri);
      setPhotoURI(result.assets[0].uri);
    }
  };

  // Fotoğrafı base64'e dönüştürme
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

  // Tarih seçimi
  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      console.log("Seçilen tarih:", selectedDate);
      setBirthDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === "ios");
  };

  // Güncelleme işlemi (PUT isteği)
  const handleSubmit = async () => {
    try {
      setLoadingSubmit(true);
      let photoBase64 = resumeData?.photoPath || null;
      if (photoURI) {
        photoBase64 = await convertToBase64(photoURI);
      }
      const dataToSend = {
        id: resumeData.id,
        photoPath: photoBase64,
        registrationNumber: Number(form.registrationNumber),
        name: form.firstName,
        lastName: form.lastName,
        birthDate: birthDate.toISOString(),
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
        isAnsweredLookingForJobMail: false,
        notes: form.notes,
      };
      console.log("Gönderilecek veri:", dataToSend);
      const updated = await PutRealApi("Resume", dataToSend);
      console.log("Güncelleme sonucu:", updated);
      if (updated) {
        alert("Özgeçmiş güncellendi.");
        navigation.goBack();
      } else {
        alert("Güncelleme sırasında hata oluştu.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Beklenmedik bir hata oluştu.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingResume) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!resumeData) {
    return (
      <View style={styles.center}>
        <Text>Veri bulunamadı.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={{ color: "#fff" }}>Fotoğraf Seç</Text>
        </TouchableOpacity>

        {photoURI ? (
          <Image source={{ uri: photoURI }} style={styles.image} />
        ) : resumeData.photoPath ? (
          <Image
            source={{ uri: `data:image/png;base64,${resumeData.photoPath}` }}
            style={styles.image}
          />
        ) : null}

        <View style={styles.form}>
          <Text style={styles.title}>Özgeçmiş Düzenle</Text>

          <TextInput
            style={styles.input}
            placeholder="Oda Sicil No"
            value={form.registrationNumber}
            onChangeText={(val) => handleChange("registrationNumber", val)}
          />

          <TextInput
            style={styles.input}
            placeholder="İsim"
            value={form.firstName}
            onChangeText={(val) => handleChange("firstName", val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Soyisim"
            value={form.lastName}
            onChangeText={(val) => handleChange("lastName", val)}
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{birthDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              onChange={onDateChange}
            />
          )}

          <Picker
            style={styles.picker}
            selectedValue={form.gender}
            onValueChange={(val) => handleChange("gender", val)}
          >
            <Picker.Item label="Cinsiyet Seçin" value={null} />
            <Picker.Item label="Kadın" value={1} />
            <Picker.Item label="Erkek" value={2} />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Telefon"
            value={form.phone}
            onChangeText={(val) => handleChange("phone", val)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(val) => handleChange("email", val)}
            keyboardType="email-address"
          />

          <Picker
            style={styles.picker}
            selectedValue={form.militaryStatus}
            onValueChange={(val) => handleChange("militaryStatus", val)}
          >
            <Picker.Item label="Askerlik Durumu Seçin" value={null} />
            <Picker.Item label="Muaf" value={1} />
            <Picker.Item label="Tecili" value={2} />
            <Picker.Item label="Yapıldı" value={3} />
            <Picker.Item label="Yapılıyor" value={4} />
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={form.licenseClass}
            onValueChange={(val) => handleChange("licenseClass", val)}
          >
            <Picker.Item label="Sürücü Belgesi Seçin" value={null} />
            <Picker.Item label="A" value={1} />
            <Picker.Item label="A1" value={2} />
            <Picker.Item label="A2" value={3} />
            <Picker.Item label="B" value={4} />
            <Picker.Item label="B2" value={5} />
            <Picker.Item label="C" value={6} />
            <Picker.Item label="D" value={7} />
            <Picker.Item label="E" value={8} />
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={form.experience}
            onValueChange={(val) => handleChange("experience", val)}
          >
            <Picker.Item label="Deneyim Durumu Seçin" value={null} />
            <Picker.Item label="Deneyimi Yok" value={0} />
            <Picker.Item label="1 Yıl" value={1} />
            <Picker.Item label="2 Yıl" value={2} />
            <Picker.Item label="3 Yıl" value={3} />
            <Picker.Item label="4 Yıl" value={4} />
            <Picker.Item label="5 Yıl" value={5} />
            <Picker.Item label="6 Yıl" value={6} />
            <Picker.Item label="7 Yıl" value={7} />
            <Picker.Item label="8 Yıl" value={8} />
            <Picker.Item label="9 Yıl" value={9} />
            <Picker.Item label="10 Yıl ve Üzeri" value={10} />
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={form.jobSeeking}
            onValueChange={(val) => handleChange("jobSeeking", val)}
          >
            <Picker.Item label="İş Arıyor mu?" value={null} />
            <Picker.Item label="Evet" value={true} />
            <Picker.Item label="Hayır" value={false} />
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Adres"
            value={form.address}
            onChangeText={(val) => handleChange("address", val)}
          />

          <TextInput
            style={styles.input}
            placeholder="İlçe"
            value={form.district}
            onChangeText={(val) => handleChange("district", val)}
          />

          <TextInput
            style={styles.input}
            placeholder="İl"
            value={form.province}
            onChangeText={(val) => handleChange("province", val)}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Notlar"
            value={form.notes}
            onChangeText={(val) => handleChange("notes", val)}
            multiline
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
            {loadingSubmit ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Güncelle
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default GeneralInformation;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginTop: 16,
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
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  image: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: "center",
  },
});
