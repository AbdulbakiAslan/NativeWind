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
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../../Components/ApiService";

const MyCertificates = () => {
  // Özgeçmiş verisini saklayacağımız state
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // Sertifika listesi ve yüklenme durumu
  const [certificatesData, setCertificatesData] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);

  // Form ve modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    certificateName: "",
    certificateInfo: "",
    resumeId: null,
  });

  // Bileşen ilk yüklendiğinde özgeçmiş verisini ve sertifikaları çek
  useEffect(() => {
    fetchResumeData();
  }, []);

  // Özgeçmiş verisi çekme
  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      // Örnek: /api/Resume/myResumeData
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
        // Özgeçmiş yüklendikten sonra sertifikaları da çek
        fetchCertificates();
      }
    } catch (error) {
      console.error("Resume data fetch error:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  // Sertifikaları çekme
  const fetchCertificates = async () => {
    try {
      setLoadingCertificates(true);
      // Postman örneğinde olduğu gibi: /api/Resume/myResumeData/Certificate
      const result = await GetRealApi("Resume/myResumeData/Certificate");
      if (Array.isArray(result)) {
        setCertificatesData(result);
      }
    } catch (error) {
      console.error("Certificates fetch error:", error);
    } finally {
      setLoadingCertificates(false);
    }
  };

  // Formu sıfırla (modal açarken/düzenlemeyi iptal ederken)
  const resetForm = () => {
    setForm({
      id: null,
      certificateName: "",
      certificateInfo: "",
      resumeId: resumeData?.id ?? null,
    });
  };

  // Ekle/Güncelle butonuna basıldığında
  const handleSubmit = async () => {
    if (!form.certificateName) {
      Alert.alert("Uyarı", "Lütfen sertifika adını giriniz.");
      return;
    }
    try {
      // Güncelleme (PUT)
      if (form.id) {
        const payload = {
          id: form.id,
          certificateName: form.certificateName,
          certificateInfo: form.certificateInfo,
          resumeId: form.resumeId,
        };
        // /api/MyCertificate
        const updated = await PutRealApi("MyCertificate", payload);
        if (updated) {
          Alert.alert("Başarılı", "Sertifika güncellendi.");
          fetchCertificates();
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } 
      // Yeni ekleme (POST)
      else {
        const payload = {
          certificateName: form.certificateName,
          certificateInfo: form.certificateInfo,
          resumeId: resumeData?.id,
        };
        // /api/MyCertificate
        const created = await PostRealApi("MyCertificate", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni sertifika eklendi.");
          fetchCertificates();
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("Kayıt işlemi hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // Silme işlemi
  const handleDelete = (id) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            // /api/MyCertificate/{id}
            const result = await DeleteRealApi(`MyCertificate/${id}`);
            if (result) {
              Alert.alert("Başarılı", "Kayıt silindi.");
              fetchCertificates();
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

  // Düzenleme işlemine tıklandığında formu doldurup modal aç
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      certificateName: item.certificateName,
      certificateInfo: item.certificateInfo,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

  // Yüklenme durumları
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
        <Text>Geçerli özgeçmiş bilgisi bulunamadı.</Text>
      </View>
    );
  }

  if (loadingCertificates) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Listede sertifika satırını çizim fonksiyonu
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

      {/* Sertifika Listesi */}
      {certificatesData.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 8 }}>
          Henüz bir sertifika eklenmemiş.
        </Text>
      ) : (
        <FlatList
          data={certificatesData}
          renderItem={renderCertificateItem}
          keyExtractor={(item) => item.id?.toString()}
        />
      )}

      {/* Modal (Ekle/Düzenle Formu) */}
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

export default MyCertificates;

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
