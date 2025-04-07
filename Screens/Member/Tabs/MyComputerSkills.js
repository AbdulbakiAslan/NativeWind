// MyComputerSkills.js
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

// API fonksiyonları
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../../Components/ApiService";

const MyComputerSkills = () => {
  // 1) ÖZGEÇMİŞ (resume) verisini burada çekeceğiz
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // 2) Bilgisayar becerisi kayıtları ve beceri türleri
  const [computerSkillsData, setComputerSkillsData] = useState([]);
  const [computerSkillTypes, setComputerSkillTypes] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  // 3) Modal ve form state
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    computerSkillTypeId: null,
    level: null,
    resumeId: null, // Resume çekildikten sonra set edilecek
  });

  // 1. Adım: Sayfa açılır açılmaz resume’yi çek
  useEffect(() => {
    fetchResumeData();
  }, []);

  // Resume verisini çek
  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      // MyLanguage.js’de olduğu gibi:
      // GET /api/Resume/myResumeData
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
        // Resume geldikten sonra skill türlerini ve skill kayıtlarını çek
        fetchComputerSkillTypes();
        fetchComputerSkills(result.id);
      }
    } catch (error) {
      console.error("Resume data fetch error:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  // Bilgisayar becerisi türlerini çek
  const fetchComputerSkillTypes = async () => {
    try {
      // Doğru endpoint
      const result = await GetRealApi("ComputerSkillType");
      if (Array.isArray(result)) {
        setComputerSkillTypes(result);
      }
    } catch (error) {
      console.error("Bilgisayar becerisi türleri çekilirken hata:", error);
    }
  };
  

  // Bilgisayar becerisi kayıtlarını çek
  const fetchComputerSkills = async (resumeId) => {
    try {
      setLoadingSkills(true);
      const result = await GetRealApi("Resume/myResumeData/ComputerSkill");
      if (Array.isArray(result)) {
        const filtered = result.filter((item) => item.resumeId === resumeId);
        setComputerSkillsData(filtered);
      }
    } catch (error) {
      console.error("Bilgisayar becerileri çekilirken hata:", error);
    } finally {
      setLoadingSkills(false);
    }
  };
  

  // Formu sıfırla
  const resetForm = () => {
    setForm({
      id: null,
      computerSkillTypeId: null,
      level: null,
      resumeId: resumeData?.id ?? null,
    });
  };

  // Ekleme / Güncelleme (POST / PUT)
  const handleSubmit = async () => {
    if (!form.computerSkillTypeId) {
      Alert.alert("Uyarı", "Lütfen bir beceri türü seçin.");
      return;
    }
    if (!form.level) {
      Alert.alert("Uyarı", "Lütfen bir seviye seçin.");
      return;
    }
    try {
      if (form.id) {
        // Güncelleme (PUT /api/MyComputerSkill)
        const payload = {
          id: form.id,
          computerSkillTypeId: form.computerSkillTypeId,
          level: form.level,
          resumeId: form.resumeId,
        };
        const updated = await PutRealApi("MyComputerSkill", payload);
        if (updated) {
          Alert.alert("Başarılı", "Bilgisayar becerisi güncellendi.");
          fetchComputerSkills(resumeData?.id);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        // Ekleme (POST /api/MyComputerSkill)
        const payload = {
          computerSkillTypeId: form.computerSkillTypeId,
          level: form.level,
          resumeId: resumeData?.id,
        };
        const created = await PostRealApi("MyComputerSkill", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni bilgisayar becerisi eklendi.");
          fetchComputerSkills(resumeData?.id);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("Bilgisayar becerisi kaydı hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // Silme işlemi (DELETE)
  const handleDelete = (skillId) => {
    Alert.alert(
      "Silme Onayı",
      "Bu bilgisayar becerisini silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await DeleteRealApi(`MyComputerSkill/${skillId}`);
              if (result) {
                Alert.alert("Başarılı", "Bilgisayar becerisi silindi.");
                fetchComputerSkills(resumeData?.id);
              } else {
                Alert.alert("Hata", "Silme işlemi başarısız oldu.");
              }
            } catch (error) {
              console.error("Bilgisayar becerisi silme hatası:", error);
            }
          },
        },
      ]
    );
  };

  // Düzenleme butonu
  const handleEdit = (item) => {
    // item.computerSkillType -> "Excel" vb. 
    // item.level -> "****" ya da integer
    // Sunucunun dönme şekline göre parse edeceğiz:
    const matchedType = computerSkillTypes.find(
      (t) => t.text === item.computerSkillType
    );
    const foundId = matchedType ? matchedType.id : null;
    let numericLevel = parseInt(item.level, 10);
    if (isNaN(numericLevel)) {
      numericLevel = item.level ? item.level.length : 0;
    }
    setForm({
      id: item.id,
      computerSkillTypeId: foundId,
      level: numericLevel,
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
          Hata: Geçerli bir özgeçmiş (Resume) bulunamadı.
        </Text>
      </View>
    );
  }

  // 3) Beceriler yükleniyor mu?
  if (loadingSkills) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Liste elemanı render
  const renderSkillItem = ({ item }) => {
    const skillName = item.computerSkillType || "Bilinmeyen Beceri";
    // Seviye gösterimi
    const getStars = (val) => {
      if (!val) return "";
      if (typeof val === "string" && val.includes("*")) return val;
      const num = parseInt(val, 10);
      if (!isNaN(num) && num > 0) {
        return "★".repeat(num);
      }
      return "";
    };
    const levelStars = getStars(item.level);

    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>{skillName}</Text>
          <Text>Seviye: {levelStars}</Text>
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

  // Ekran
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

      {/* Bilgisayar Becerileri Listesi */}
      {computerSkillsData.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 8 }}>
          Henüz bilgisayar becerisi eklenmemiş.
        </Text>
      ) : (
        <FlatList
          data={computerSkillsData}
          renderItem={renderSkillItem}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        />
      )}

      {/* Modal (Ekle/Düzenle) */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id
                ? "Bilgisayar Becerisi Düzenle"
                : "Yeni Bilgisayar Becerisi Ekle"}
            </Text>

            {/* Beceri Türü */}
            <Text style={styles.label}>Beceri Türü:</Text>
            <Picker
              selectedValue={form.computerSkillTypeId}
              style={styles.picker}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, computerSkillTypeId: val }))
              }
            >
              <Picker.Item label="Seçiniz..." value={null} />
              {computerSkillTypes.map((type) => (
                <Picker.Item key={type.id} label={type.text} value={type.id} />
              ))}
            </Picker>

            {/* Seviye */}
            <Text style={styles.label}>Seviye (1 - 5):</Text>
            <Picker
              selectedValue={form.level}
              style={styles.picker}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, level: val }))
              }
            >
              <Picker.Item label="Seçiniz..." value={null} />
              <Picker.Item label="* (1)" value={1} />
              <Picker.Item label="** (2)" value={2} />
              <Picker.Item label="*** (3)" value={3} />
              <Picker.Item label="**** (4)" value={4} />
              <Picker.Item label="***** (5)" value={5} />
            </Picker>

            {/* Modal Butonları */}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyComputerSkills;

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
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
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
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  picker: { marginVertical: 8, backgroundColor: "#fff" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
