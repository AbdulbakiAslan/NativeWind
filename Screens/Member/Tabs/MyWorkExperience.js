// MyWorkExperience.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckBox } from "react-native-elements";
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../../Components/ApiService";

// === 1) Tarih Gösterimi (GG/AA/YY) ===
const formatDisplayDate = (dateObj) => {
  if (!dateObj) return "";
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// === 2) API'ye Gönderilecek Tarih (ISO8601) ===
const formatApiDate = (dateObj) => {
  if (!dateObj) return null;
  return dateObj.toISOString();
};

const MyWorkExperience = () => {
  // Özgeçmiş bilgisini API'den çekelim (MyLanguage.js örneğinde olduğu gibi)
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // Deneyim ve çalışma alanı verileri
  const [experienceData, setExperienceData] = useState([]);
  const [workingAreas, setWorkingAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Tarih seçicilerin kontrolü
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Form state
  const [form, setForm] = useState({
    id: null,
    experienceName: "",
    companyName: "",
    startDate: null,
    endDate: null,
    workingAreaList: [],
    resumeId: null,
  });

  // Özgeçmişi API'den çek (GET "Resume/myResumeData")
  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
        // Özgeçmişi aldıktan sonra deneyimleri ve çalışma alanlarını çek
        fetchExperiences(result.id);
        fetchWorkingAreas();
        // Form'daki resumeId bilgisini güncelleyelim
        setForm((prev) => ({ ...prev, resumeId: result.id }));
      } else {
        Alert.alert("Hata", "Geçerli özgeçmiş bilgisi bulunamadı.");
      }
    } catch (error) {
      console.error("Resume verileri alınırken hata oluştu:", error);
      Alert.alert("Hata", "Resume bilgisi alınırken hata oluştu.");
    } finally {
      setLoadingResume(false);
    }
  };

  // === 3) Deneyim Kayıtlarını Getir (GET "Resume/myResumeData/Experience") ===
  const fetchExperiences = async (resumeId) => {
    try {
      setLoading(true);
      const result = await GetRealApi("Resume/myResumeData/Experience");
      if (Array.isArray(result)) {
        // Sadece bu resumeId'ye ait kayıtları filtreleyelim
        const filtered = result.filter(exp => exp.resumeId === resumeId);
        setExperienceData(filtered);
      } else {
        console.warn("Resume/myResumeData/Experience API’den beklenmeyen veri döndü.");
        Alert.alert("Hata", "API GET Hatası: HTTP 404");
      }
    } catch (error) {
      console.error("Experience verileri alınırken hata oluştu:", error);
      Alert.alert("Hata", "API GET Hatası: HTTP 404");
    } finally {
      setLoading(false);
    }
  };

  // === 4) Çalışma Alanlarını Getir (GET "WorkingArea") ===
  const fetchWorkingAreas = async () => {
    try {
      const result = await GetRealApi("WorkingArea");
      if (Array.isArray(result)) {
        setWorkingAreas(result);
      } else {
        console.warn("WorkingArea API’den beklenmeyen veri döndü.");
      }
    } catch (error) {
      console.error("WorkingArea alınırken hata oluştu:", error);
    }
  };

  // === 5) Formu Sıfırla ===
  const resetForm = () => {
    setForm({
      id: null,
      experienceName: "",
      companyName: "",
      startDate: null,
      endDate: null,
      workingAreaList: [],
      resumeId: resumeData?.id || null,
    });
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  // === 6) KAYDET (POST / PUT) (MyExperience endpoint) ===
  const handleSubmit = async () => {
    if (!form.experienceName || !form.companyName) {
      Alert.alert("Uyarı", "Lütfen zorunlu alanları (Deneyim Adı, Şirket Adı) doldurun.");
      return;
    }

    const payload = {
      id: form.id,
      experienceName: form.experienceName,
      companyName: form.companyName,
      startDate: formatApiDate(form.startDate),
      endDate: formatApiDate(form.endDate),
      workingAreaList: form.workingAreaList,
      resumeId: form.resumeId,
    };

    try {
      if (form.id) {
        const updated = await PutRealApi("MyExperience", payload);
        if (updated) {
          Alert.alert("Başarılı", "Deneyim güncellendi.");
          fetchExperiences(form.resumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        const created = await PostRealApi("MyExperience", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni deneyim eklendi.");
          fetchExperiences(form.resumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("MyExperience kaydı işlemi hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // === 7) Silme İşlemi (DELETE "MyExperience/{experienceId}") ===
  const handleDelete = (experienceId) => {
    Alert.alert("Silme Onayı", "Bu deneyimi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await DeleteRealApi(`MyExperience/${experienceId}`);
            if (result) {
              Alert.alert("Başarılı", "Deneyim silindi.");
              fetchExperiences(form.resumeId);
            } else {
              Alert.alert("Hata", "Silme işlemi başarısız oldu.");
            }
          } catch (error) {
            console.error("MyExperience silme hatası:", error);
          }
        },
      },
    ]);
  };

  // === 8) Düzenleme: Form'a Aktar ===
  const handleEdit = (item) => {
    let selectedIds = [];
    if (item.workingAreas && workingAreas.length > 0) {
      const splitted = item.workingAreas.split(",").map((s) => s.trim());
      selectedIds = workingAreas
        .filter((wa) => splitted.includes(wa.name))
        .map((wa) => wa.id.toString());
    }

    setForm({
      id: item.id,
      experienceName: item.experienceName,
      companyName: item.companyName,
      startDate: item.startDate ? new Date(item.startDate) : null,
      endDate: item.endDate ? new Date(item.endDate) : null,
      workingAreaList: selectedIds,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

  // === 9) Çoklu Çalışma Alanı Seçimi ===
  const toggleWorkingArea = (waId) => {
    const waIdStr = waId.toString();
    setForm((prev) => {
      const alreadySelected = prev.workingAreaList.includes(waIdStr);
      let newList = alreadySelected
        ? prev.workingAreaList.filter((id) => id !== waIdStr)
        : [...prev.workingAreaList, waIdStr];
      return { ...prev, workingAreaList: newList };
    });
  };

  // === 10) FlatList Render ===
  const renderExperienceItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>
            {item.experienceName} - {item.companyName}
          </Text>
          <Text>
            {item.startDate
              ? formatDisplayDate(new Date(item.startDate))
              : "??/??/??"}{" "}
            -{" "}
            {item.endDate
              ? formatDisplayDate(new Date(item.endDate))
              : "??/??/??"}
          </Text>
          <Text>Çalışma Alanları: {item.workingAreas || "Belirtilmedi"}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <MaterialIcons name="edit" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Yükleme durumları
  if (loadingResume) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!resumeData || !resumeData.id) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Geçerli özgeçmiş bilgisi bulunamadı.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={experienceData}
        renderItem={renderExperienceItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Deneyimi Düzenle" : "Yeni Deneyim Ekle"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Deneyim Adı"
              value={form.experienceName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, experienceName: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Şirket Adı"
              value={form.companyName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, companyName: text }))
              }
            />

            <Text style={styles.label}>Başlangıç Tarihi (GG/AA/YY)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {form.startDate ? formatDisplayDate(form.startDate) : "Tarih Seç"}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={form.startDate || new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setForm((prev) => ({ ...prev, startDate: selectedDate }));
                  }
                  setShowStartPicker(false);
                }}
              />
            )}

            <Text style={styles.label}>Bitiş Tarihi (GG/AA/YY)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {form.endDate ? formatDisplayDate(form.endDate) : "Tarih Seç"}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={form.endDate || new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setForm((prev) => ({ ...prev, endDate: selectedDate }));
                  }
                  setShowEndPicker(false);
                }}
              />
            )}

            <Text style={[styles.label, { marginTop: 10 }]}>
              Çalışma Alanları
            </Text>
            {workingAreas.map((wa) => {
              const isSelected = form.workingAreaList.includes(wa.id.toString());
              return (
                <CheckBox
                  key={wa.id}
                  title={wa.name}
                  checked={isSelected}
                  onPress={() => toggleWorkingArea(wa.id)}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    padding: 0,
                  }}
                  checkedColor="#10B981"
                  uncheckedColor="#999"
                />
              );
            })}

            <View style={styles.modalButtons}>
              <Button title="Kaydet" onPress={handleSubmit} />
              <Button
                title="İptal"
                color="red"
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default MyWorkExperience;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 8 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  dateButtonText: {
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
