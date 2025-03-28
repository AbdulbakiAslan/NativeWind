// MyLanguage.js
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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
  GetRealApi,
  DeleteRealApi,
  PostRealApi,
  PutRealApi,
} from "../../../Components/ApiService";

const MyLanguage = () => {
  // 1) ÖZGEÇMİŞ VERİSİ (MyCourses.js mantığı)
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // 2) DİL LİSTESİ VE TÜRLERİ
  const [languagesData, setLanguagesData] = useState([]);
  const [languageTypes, setLanguageTypes] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  // 3) MODAL VE FORM STATE
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    languageTypeId: null,
    level: 1,
    resumeId: null, // Özgeçmiş yüklendikten sonra set edilecek
  });

  // Sayfa ilk açıldığında özgeçmişi çek
  useEffect(() => {
    fetchResumeData();
  }, []);

  // Özgeçmişi yükle
  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      // GET /api/Resume/myResumeData
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
        // Özgeçmişi aldıktan sonra dil türlerini ve dil kayıtlarını çek
        fetchLanguageTypes();
        fetchLanguages(result.id);
      }
    } catch (error) {
      console.error("Resume data fetch error:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  // Dil türlerini çek
  const fetchLanguageTypes = async () => {
    try {
      const result = await GetRealApi("LanguageType");
      if (Array.isArray(result)) {
        setLanguageTypes(result);
      }
    } catch (error) {
      console.error("Dil türleri alınırken hata:", error);
    }
  };

  // Dil kayıtlarını çek
  const fetchLanguages = async (resumeId) => {
    try {
      setLoadingLanguages(true);
      // GET /api/Resume/myResumeData/Language
      const result = await GetRealApi("Resume/myResumeData/Language");
      if (Array.isArray(result)) {
        // Sadece bu özgeçmişe ait kayıtları filtrele
        const filtered = result.filter((lang) => lang.resumeId === resumeId);
        setLanguagesData(filtered);
      }
    } catch (error) {
      console.error("Dil verileri alınırken hata:", error);
    } finally {
      setLoadingLanguages(false);
    }
  };

  // Formu sıfırla
  const resetForm = () => {
    setForm({
      id: null,
      languageTypeId: null,
      level: 1,
      resumeId: resumeData?.id ?? null,
    });
  };

  // Ekle/Güncelle butonuna basıldığında
  const handleSubmit = async () => {
    if (!form.languageTypeId) {
      Alert.alert("Uyarı", "Lütfen bir dil türü seçin.");
      return;
    }
    try {
      // Güncelleme (PUT)
      if (form.id) {
        const dataToSend = {
          id: form.id,
          languageTypeId: form.languageTypeId,
          level: form.level,
          resumeId: form.resumeId,
        };
        // PUT /api/MyLanguage
        const updated = await PutRealApi("MyLanguage", dataToSend);
        if (updated) {
          Alert.alert("Başarılı", "Dil bilgisi güncellendi.");
          fetchLanguages(resumeData?.id);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      }
      // Yeni ekleme (POST)
      else {
        const dataToSend = {
          languageTypeId: form.languageTypeId,
          level: form.level,
          resumeId: resumeData?.id,
        };
        // POST /api/MyLanguage
        const created = await PostRealApi("MyLanguage", dataToSend);
        if (created) {
          Alert.alert("Başarılı", "Dil bilgisi eklendi.");
          fetchLanguages(resumeData?.id);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("İşlem hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // Silme işlemi
  const handleDelete = (languageId) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            // DELETE /api/Language/{id} (örnek, endpoint’inize göre düzenleyin)
            const result = await DeleteRealApi(`Language/${languageId}`);
            if (result) {
              Alert.alert("Başarılı", "Dil bilgisi silindi.");
              fetchLanguages(resumeData?.id);
            } else {
              Alert.alert("Hata", "Silme işlemi başarısız oldu.");
            }
          } catch (error) {
            console.error("Silme hatası:", error);
          }
        },
      },
    ]);
  };

  // Düzenleme butonu
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      languageTypeId: item.languageTypeId,
      level: item.level,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

  // 1) Resume yükleniyor mu?
  if (loadingResume) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2) Geçerli resume var mı?
  if (!resumeData || !resumeData.id) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Geçerli özgeçmiş bilgisi bulunamadı.
        </Text>
      </View>
    );
  }

  // 3) Diller yükleniyor mu?
  if (loadingLanguages) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // FlatList’te göstereceğimiz öğeleri çiz
  const renderLanguageItem = ({ item }) => {
    const matchedType = languageTypes.find(
      (type) => type.id === item.languageTypeId
    );
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>
            {(matchedType && matchedType.text) || "Bilinmeyen Dil"}
          </Text>
          <Text>Seviye: {item.level}</Text>
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

  return (
    <View style={styles.container}>
      {/* Ekle Butonu */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Ekle</Text>
      </TouchableOpacity>

      {/* Dil Listesi */}
      {languagesData.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 8 }}>
          Henüz dil bilgisi eklenmemiş.
        </Text>
      ) : (
        <FlatList
          data={languagesData}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.id?.toString()}
        />
      )}

      {/* Modal (Ekle/Düzenle Formu) */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Dil Düzenle" : "Dil Ekle"}
            </Text>

            <Text style={styles.label}>Dil Türü:</Text>
            <Picker
              selectedValue={form.languageTypeId}
              style={styles.picker}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, languageTypeId: val }))
              }
            >
              <Picker.Item label="Seçiniz..." value={null} />
              {languageTypes.map((type) => (
                <Picker.Item key={type.id} label={type.text} value={type.id} />
              ))}
            </Picker>

            <Text style={styles.label}>Seviye:</Text>
            <Picker
              selectedValue={form.level}
              style={styles.picker}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, level: val }))
              }
            >
              <Picker.Item label="*" value={1} />
              <Picker.Item label="**" value={2} />
              <Picker.Item label="***" value={3} />
              <Picker.Item label="****" value={4} />
              <Picker.Item label="*****" value={5} />
            </Picker>

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
        </View>
      </Modal>
    </View>
  );
};

export default MyLanguage;

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
  addButtonText: { color: "#fff", fontWeight: "bold" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  itemTitle: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 8 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  picker: { marginVertical: 8, backgroundColor: "#fff" },
});
