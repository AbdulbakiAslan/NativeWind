// Screens/Company/MyJobPostingCreate.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GetRealApi, PostRealApi, PutRealApi } from "../../Components/ApiService";

const MyJobPostingCreate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingId = route.params?.id;

  // Form state (companyId kaldırıldı)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [militaryServiceStatus, setMilitaryServiceStatus] = useState("");
  const [driversLicenseClass, setDriversLicenseClass] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [selectedWorkingAreas, setSelectedWorkingAreas] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lookup data
  const [enums, setEnums] = useState([]);
  const [workingAreas, setWorkingAreas] = useState([]);

  useEffect(() => {
    const fetchLookups = async () => {
      // Enum ve çalışma alanlarını getir
      const enumData = await GetRealApi("Enums", navigation);
      setEnums(Array.isArray(enumData) ? enumData : []);
      const waData = await GetRealApi("WorkingArea", navigation);
      setWorkingAreas(Array.isArray(waData) ? waData : []);

      // Düzenleme modundaysa mevcut verileri al
      if (editingId) {
        setLoading(true);
        const existing = await GetRealApi(`MyJobPosting/${editingId}`, navigation);
        if (existing) {
          setTitle(existing.title || "");
          setDescription(existing.description || "");
          setGender(String(existing.gender));
          setMilitaryServiceStatus(String(existing.militaryServiceStatus));
          setDriversLicenseClass(String(existing.driversLicenseClass));
          setMinExperience(String(existing.minExperience));
          setSelectedWorkingAreas(existing.workingAreaList || []);
          setIsActive(Boolean(existing.isActive));
        }
        setLoading(false);
      }
    };

    fetchLookups();
  }, [editingId, navigation]);

  const getEnumList = (name) =>
    enums.find((e) => e.enumName === name)?.enumList || [];

  const toggleWorkingArea = (id) => {
    setSelectedWorkingAreas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    // Basit validasyonlar
    if (!title.trim()) {
      ToastAndroid.show("Başlık boş olamaz", ToastAndroid.SHORT);
      return;
    }

    // Gönderilecek payload (companyId kaldırıldı)
    const payload = {
      title,
      description,
      isApproved: true,
      gender: Number(gender),
      militaryServiceStatus: Number(militaryServiceStatus),
      driversLicenseClass: Number(driversLicenseClass),
      minExperience: Number(minExperience),
      workingAreaList: selectedWorkingAreas,
      isActive,
    };

    let result;
    if (editingId) {
      // Düzenleme: id ekleyip PUT
      payload.id = editingId;
      result = await PutRealApi("MyJobPosting", payload, navigation);
    } else {
      // Yeni ilan: POST
      result = await PostRealApi("MyJobPosting", payload, navigation);
    }

    if (result) {
      ToastAndroid.show(
        editingId ? "İlan güncellendi" : "İlan oluşturuldu",
        ToastAndroid.SHORT
      );
      navigation.goBack(); // Liste ekranına dön ve yenile
    } else {
      ToastAndroid.show("İşlem başarısız oldu", ToastAndroid.SHORT);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {editingId ? "İlanı Düzenle" : "Yeni İş İlanı"}
      </Text>

      {/* Başlık */}
      <Text style={styles.label}>Başlık</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      {/* Açıklama */}
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Cinsiyet */}
      <Text style={styles.label}>Cinsiyet</Text>
      <Picker
        selectedValue={gender}
        onValueChange={setGender}
        style={styles.input}
      >
        <Picker.Item label="Seçin" value="" />
        {getEnumList("Genders").map((e) => (
          <Picker.Item key={e.value} label={e.text} value={String(e.value)} />
        ))}
      </Picker>

      {/* Askerlik */}
      <Text style={styles.label}>Askerlik</Text>
      <Picker
        selectedValue={militaryServiceStatus}
        onValueChange={setMilitaryServiceStatus}
        style={styles.input}
      >
        <Picker.Item label="Seçin" value="" />
        {getEnumList("MilitaryServiceStatuses").map((e) => (
          <Picker.Item key={e.value} label={e.text} value={String(e.value)} />
        ))}
      </Picker>

      {/* Sürücü Belgesi */}
      <Text style={styles.label}>Sürücü Belgesi</Text>
      <Picker
        selectedValue={driversLicenseClass}
        onValueChange={setDriversLicenseClass}
        style={styles.input}
      >
        <Picker.Item label="Seçin" value="" />
        {getEnumList("DriversLicenseClasses").map((e) => (
          <Picker.Item key={e.value} label={e.text} value={String(e.value)} />
        ))}
      </Picker>

      {/* Min. Deneyim */}
      <Text style={styles.label}>Min. Deneyim</Text>
      <Picker
        selectedValue={minExperience}
        onValueChange={setMinExperience}
        style={styles.input}
      >
        <Picker.Item label="Seçin" value="" />
        {getEnumList("ExperienceStatuses").map((e) => (
          <Picker.Item key={e.value} label={e.text} value={String(e.value)} />
        ))}
      </Picker>

      {/* Çalışma Alanları */}
      <Text style={styles.label}>Çalışma Alanları</Text>
      <View style={styles.multiSelectContainer}>
        {workingAreas.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={styles.multiSelectItem}
            onPress={() => toggleWorkingArea(w.id)}
          >
            <Text style={styles.multiSelectText}>{w.name}</Text>
            {selectedWorkingAreas.includes(w.id) && <Text>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Aktif Mi? */}
      <Text style={styles.label}>Aktif Mi?</Text>
      <Picker
        selectedValue={String(isActive)}
        onValueChange={(v) => setIsActive(v === "true")}
        style={styles.input}
      >
        <Picker.Item label="Hayır" value="false" />
        <Picker.Item label="Evet" value="true" />
      </Picker>

      {/* İptal / Kaydet */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>İptal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>
            {editingId ? "Güncelle" : "Kaydet"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MyJobPostingCreate;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5faff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 4,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  multiSelectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  multiSelectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  multiSelectText: { fontSize: 16, color: "#374151" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: { color: "#fff", fontWeight: "bold" },
  submitButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 8,
  },
  submitText: { color: "#fff", fontWeight: "bold" },
});
