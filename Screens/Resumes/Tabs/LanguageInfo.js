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

const LanguageInfo = (props) => {
  const { resume } = props;
  const effectiveResumeId = resume?.id;

  if (!effectiveResumeId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Hata: Resume ID bulunamadı. Lütfen geçerli parametre gönderildiğinden emin olun.
        </Text>
      </View>
    );
  }

  const [languagesData, setLanguagesData] = useState([]);
  const [languageTypes, setLanguageTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    languageTypeId: null,
    level: 1,
    resumeId: effectiveResumeId,
  });

  useEffect(() => {
    fetchLanguageTypes();
    fetchLanguages(effectiveResumeId);
  }, [effectiveResumeId]);

  // Dil türlerini çekiyoruz
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

  // İlgili resumeId'ye ait dil kayıtlarını çekiyoruz
  const fetchLanguages = async (id) => {
    try {
      setLoading(true);
      const result = await GetRealApi(`Language?resumeId=${id}`);
      if (Array.isArray(result)) {
        setLanguagesData(result.filter((lang) => lang.resumeId === id));
      }
    } catch (error) {
      console.error("Dil verileri alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // Silme işlemi
  const handleDelete = async (languageId) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const result = await DeleteRealApi(`Language/${languageId}`);
          if (result) {
            Alert.alert("Başarılı", "Dil bilgisi silindi.");
            fetchLanguages(effectiveResumeId);
          } else {
            Alert.alert("Hata", "Silme işlemi başarısız oldu.");
          }
        },
      },
    ]);
  };

  // Ekleme / Güncelleme işlemi
  const handleSubmit = async () => {
    if (!form.languageTypeId) {
      Alert.alert("Uyarı", "Lütfen bir dil türü seçin.");
      return;
    }
    try {
      if (form.id) {
        // Güncelleme modu: PUT isteği
        const dataToSend = {
          id: form.id,
          languageTypeId: form.languageTypeId,
          level: form.level,
          resumeId: form.resumeId,
        };
        console.log("PUT isteğiyle gönderilecek veri:", dataToSend);
        const updated = await PutRealApi("Language", dataToSend);
        if (updated) {
          Alert.alert("Başarılı", "Dil bilgisi güncellendi.");
          fetchLanguages(effectiveResumeId);
          setModalVisible(false);
          setForm({ id: null, languageTypeId: null, level: 1, resumeId: effectiveResumeId });
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        // Ekleme modu: POST isteği
        const dataToSend = {
          languageTypeId: form.languageTypeId,
          level: form.level,
          resumeId: form.resumeId,
        };
        console.log("POST isteğiyle gönderilecek veri:", dataToSend);
        const created = await PostRealApi("Language", dataToSend);
        if (created) {
          Alert.alert("Başarılı", "Dil bilgisi eklendi.");
          fetchLanguages(effectiveResumeId);
          setModalVisible(false);
          setForm({ id: null, languageTypeId: null, level: 1, resumeId: effectiveResumeId });
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("İşlem hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // Listede gösterilecek dil kaydını render ediyoruz
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
          <TouchableOpacity
            onPress={() => {
              setForm(item);
              setModalVisible(true);
            }}
          >
            <MaterialIcons name="edit" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          setForm({ id: null, languageTypeId: null, level: 1, resumeId: effectiveResumeId });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={languagesData}
        renderItem={renderLanguageItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
                setForm({ id: null, languageTypeId: null, level: 1, resumeId: effectiveResumeId });
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LanguageInfo;

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
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  picker: { marginVertical: 8, backgroundColor: "#fff" },
});
