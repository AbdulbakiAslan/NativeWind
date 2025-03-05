import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Projenizdeki API servis fonksiyonları
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../../Components/ApiService";

const Certificates = (props) => {
  const { resume } = props;
  const effectiveResumeId = resume?.id;

  // Resume ID kontrolü
  if (!effectiveResumeId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Hata: Resume ID bulunamadı. Lütfen geçerli parametre gönderildiğinden emin olun.
        </Text>
      </View>
    );
  }

  // Ekranda gösterilecek sertifikalar
  const [certificatesData, setCertificatesData] = useState([]);
  // Yükleniyor mu kontrolü
  const [loading, setLoading] = useState(false);
  // Modal görünürlük
  const [modalVisible, setModalVisible] = useState(false);

  // Form state (yeni veya düzenlenecek sertifika)
  const [form, setForm] = useState({
    id: null,
    certificateName: "",
    certificateInfo: "",
    resumeId: effectiveResumeId,
  });

  // Sayfa yüklendiğinde / resumeId değiştiğinde sertifikaları çek
  useEffect(() => {
    fetchCertificates(effectiveResumeId);
  }, [effectiveResumeId]);

  // ================== SERTİFİKALARI ÇEK (GET) ==================
  const fetchCertificates = async (resumeId) => {
    try {
      setLoading(true);
      // GET /api/Certificate?resumeId={resumeId}
      const result = await GetRealApi(`Certificate?resumeId=${resumeId}`);
      if (Array.isArray(result)) {
        setCertificatesData(result.filter((item) => item.resumeId === resumeId));
      } else {
        console.warn("API'den sertifika verisi boş veya hatalı döndü.");
      }
    } catch (error) {
      console.error("Sertifikalar çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================== FORM SIFIRLA ==================
  const resetForm = () => {
    setForm({
      id: null,
      certificateName: "",
      certificateInfo: "",
      resumeId: effectiveResumeId,
    });
  };

  // ================== EKLEME / GÜNCELLEME (POST / PUT) ==================
  const handleSubmit = async () => {
    if (!form.certificateName) {
      Alert.alert("Uyarı", "Lütfen sertifika adını giriniz.");
      return;
    }
    try {
      if (form.id) {
        // Güncelleme modu (PUT)
        const payload = {
          id: form.id,
          certificateName: form.certificateName,
          certificateInfo: form.certificateInfo,
          resumeId: form.resumeId,
        };
        console.log("PUT isteğiyle gönderilecek veri:", payload);

        const updated = await PutRealApi("Certificate", payload);
        if (updated) {
          Alert.alert("Başarılı", "Sertifika güncellendi.");
          fetchCertificates(effectiveResumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        // Ekleme modu (POST)
        const payload = {
          certificateName: form.certificateName,
          certificateInfo: form.certificateInfo,
          resumeId: form.resumeId,
        };
        console.log("POST isteğiyle gönderilecek veri:", payload);

        const created = await PostRealApi("Certificate", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni sertifika eklendi.");
          fetchCertificates(effectiveResumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("Sertifika kaydı işlemi hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // ================== SİLME (DELETE) ==================
  const handleDelete = (certificateId) => {
    Alert.alert("Silme Onayı", "Bu sertifikayı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            // DELETE /api/Certificate/{id}
            const result = await DeleteRealApi(`Certificate/${certificateId}`);
            if (result) {
              Alert.alert("Başarılı", "Sertifika silindi.");
              fetchCertificates(effectiveResumeId);
            } else {
              Alert.alert("Hata", "Silme işlemi başarısız oldu.");
            }
          } catch (error) {
            console.error("Sertifika silme hatası:", error);
          }
        },
      },
    ]);
  };

  // ================== DÜZENLEME (FORM'A AKTAR) ==================
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      certificateName: item.certificateName,
      certificateInfo: item.certificateInfo,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

  // ================== FLATLIST ITEM RENDER ==================
  const renderCertificateItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemTitle}>{item.certificateName}</Text>
        <Text>{item.certificateInfo}</Text>
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

  // ================== RENDER ==================
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
        data={certificatesData}
        renderItem={renderCertificateItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
      />

      {/* Modal: Sertifika Ekle / Düzenle */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Sertifika Düzenle" : "Yeni Sertifika Ekle"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Sertifika Adı"
              value={form.certificateName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, certificateName: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Sertifika Bilgisi"
              value={form.certificateInfo}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, certificateInfo: text }))
              }
            />

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

export default Certificates;

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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
