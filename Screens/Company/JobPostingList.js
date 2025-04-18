// JobPostingList.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { GetRealApi } from "../../Components/ApiService";

const JobPostingList = () => {
  const navigation = useNavigation();
  const [showForm, setShowForm] = useState(false);

  // Form alanları
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [military, setMilitary] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [experience, setExperience] = useState("");
  const [active, setActive] = useState("");
  const [selectedWorkingAreas, setSelectedWorkingAreas] = useState([]);

  // Lookup verileri
  const [companies, setCompanies] = useState([]);
  const [enums, setEnums] = useState([]);
  const [workingAreasList, setWorkingAreasList] = useState([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const allEnums = await GetRealApi("Enums", navigation);
        setEnums(allEnums || []);
        // Şirketleri artık /api/Company endpoint’inden çekiyoruz
        const comps = await GetRealApi("Company", navigation);
        setCompanies(comps || []);
        const wa = await GetRealApi("WorkingArea", navigation);
        setWorkingAreasList(wa || []);
      } catch (e) {
        console.error("Lookup verisi çekme hatası:", e);
      }
    };
    fetchLookups();
  }, []);

  const getEnumList = (name) =>
    enums.find((e) => e.enumName === name)?.enumList || [];

  const toggleWorkingArea = (id) =>
    setSelectedWorkingAreas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>İş İlanı Listesi</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.buttonText}>EKLE</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showForm} animationType="slide">
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.formTitle}>İş İlanı Oluştur</Text>

          <Text style={styles.label}>Şirket</Text>
          <Picker
            selectedValue={company}
            onValueChange={setCompany}
            style={styles.input}
          >
            <Picker.Item label="Lütfen Seçin" value="" />
            {companies.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Başlık</Text>
          <TextInput
            style={styles.input}
            placeholder="Başlık"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Açıklama"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Cinsiyet</Text>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.input}
          >
            <Picker.Item label="Seçin" value="" />
            {getEnumList("Genders").map((g) => (
              <Picker.Item key={g.value} label={g.text} value={g.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Askerlik Durumu</Text>
          <Picker
            selectedValue={military}
            onValueChange={setMilitary}
            style={styles.input}
          >
            <Picker.Item label="Seçin" value="" />
            {getEnumList("MilitaryServiceStatuses").map((m) => (
              <Picker.Item key={m.value} label={m.text} value={m.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Sürücü Belgesi</Text>
          <Picker
            selectedValue={driverLicense}
            onValueChange={setDriverLicense}
            style={styles.input}
          >
            <Picker.Item label="Seçin" value="" />
            {getEnumList("DriversLicenseClasses").map((l) => (
              <Picker.Item key={l.value} label={l.text} value={l.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Min. Deneyim</Text>
          <Picker
            selectedValue={experience}
            onValueChange={setExperience}
            style={styles.input}
          >
            <Picker.Item label="Seçin" value="" />
            {getEnumList("ExperienceStatuses").map((e) => (
              <Picker.Item key={e.value} label={e.text} value={e.value} />
            ))}
          </Picker>

          <Text style={styles.label}>Aktif Mi?</Text>
          <Picker
            selectedValue={active}
            onValueChange={setActive}
            style={styles.input}
          >
            <Picker.Item label="Seçin" value="" />
            <Picker.Item label="Evet" value={true} />
            <Picker.Item label="Hayır" value={false} />
          </Picker>

          <Text style={styles.label}>Çalışma Alanları</Text>
          <View style={styles.multiSelectContainer}>
            {workingAreasList.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={styles.multiSelectItem}
                onPress={() => toggleWorkingArea(area.id)}
              >
                <Text style={styles.multiSelectText}>{area.name}</Text>
                {selectedWorkingAreas.includes(area.id) && (
                  <AntDesign name="checkcircle" size={20} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.cancelText}>İPTAL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.buttonText}>KAYDET</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Text style={styles.footer}>
        Copyright © 2025 <Text style={{ fontWeight: "bold" }}>Imo.Cv.</Text> Tüm
        hakları saklıdır
      </Text>
    </ScrollView>
  );
};

export default JobPostingList;

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5faff", flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 16 },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButton: { backgroundColor: "#10B981", padding: 12, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" },
  formContainer: { padding: 16, backgroundColor: "#f5faff", flexGrow: 1 },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { marginBottom: 6, color: "#374151", fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  multiSelectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  multiSelectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  multiSelectText: { fontSize: 16, color: "#374151" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: { color: "white", fontWeight: "bold" },
  saveButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 8,
  },
  footer: { textAlign: "center", marginTop: 32, color: "#6B7280" },
});
