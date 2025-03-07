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
import { Picker } from "@react-native-picker/picker";
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../../Components/ApiService";

const References = (props) => {
  const { resume } = props;
  const effectiveResumeId = resume?.id;

  // Referans verilerini saklamak için state
  const [referencesData, setReferencesData] = useState([]);
  // Referans tipi listesini saklamak için state
  const [referenceTypes, setReferenceTypes] = useState([]);
  // Ekran yüklenirken gösterilecek loading spinner
  const [loading, setLoading] = useState(false);
  // Modal görünür/gizli
  const [modalVisible, setModalVisible] = useState(false);

  // Form state'i: Düzenleme modunda id dolu, ekleme modunda boş olacak.
  const [form, setForm] = useState({
    id: null,
    name: "",
    lastName: "",
    companyName: "",
    contact: "",
    referenceTypeId: null,
    resumeId: effectiveResumeId,
  });

  // Sayfa ilk açıldığında veya resumeId değiştiğinde verileri çek
  useEffect(() => {
    if (!effectiveResumeId) return;
    fetchReferenceTypes();
    fetchReferences(effectiveResumeId);
  }, [effectiveResumeId]);

  // ================== REFERANS TİPLERİNİ ÇEK (GET /api/ReferenceType) ==================
  const fetchReferenceTypes = async () => {
    try {
      const result = await GetRealApi("ReferenceType");
      if (Array.isArray(result)) {
        setReferenceTypes(result);
      } else {
        console.warn("ReferenceType API’den beklenmeyen bir veri döndü.");
      }
    } catch (error) {
      console.error("Referans tipleri alınırken hata oluştu:", error);
    }
  };

  // ================== REFERANSLARI ÇEK (GET /api/Reference?resumeId=) ==================
  const fetchReferences = async (resumeId) => {
    try {
      setLoading(true);
      const result = await GetRealApi(`Reference?resumeId=${resumeId}`);
      if (Array.isArray(result)) {
        setReferencesData(result);
      } else {
        console.warn("Reference API’den beklenmeyen bir veri döndü.");
      }
    } catch (error) {
      console.error("Referanslar alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================== FORM SIFIRLA ==================
  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      lastName: "",
      companyName: "",
      contact: "",
      referenceTypeId: null,
      resumeId: effectiveResumeId,
    });
  };

  // ================== KAYDET (POST / PUT) ==================
  const handleSubmit = async () => {
    if (!form.name || !form.lastName || !form.referenceTypeId) {
      Alert.alert("Uyarı", "Lütfen zorunlu alanları (Ad, Soyad, Tip) doldurun.");
      return;
    }
    try {
      if (form.id) {
        // Güncelleme modu: PUT /api/Reference
        const payload = {
          id: form.id,
          name: form.name,
          lastName: form.lastName,
          companyName: form.companyName,
          contact: form.contact,
          referenceTypeId: form.referenceTypeId,
          resumeId: form.resumeId,
        };
        const updated = await PutRealApi("Reference", payload);
        if (updated) {
          Alert.alert("Başarılı", "Referans güncellendi.");
          fetchReferences(effectiveResumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        // Ekleme modu: POST /api/Reference
        const payload = {
          name: form.name,
          lastName: form.lastName,
          companyName: form.companyName,
          contact: form.contact,
          referenceTypeId: form.referenceTypeId,
          resumeId: form.resumeId,
        };
        const created = await PostRealApi("Reference", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni referans eklendi.");
          fetchReferences(effectiveResumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("Referans kaydı işlemi hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // ================== SİL (DELETE) ==================
  const handleDelete = (referenceId) => {
    Alert.alert("Silme Onayı", "Bu referansı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await DeleteRealApi(`Reference/${referenceId}`);
            if (result) {
              Alert.alert("Başarılı", "Referans silindi.");
              fetchReferences(effectiveResumeId);
            } else {
              Alert.alert("Hata", "Silme işlemi başarısız oldu.");
            }
          } catch (error) {
            console.error("Referans silme hatası:", error);
          }
        },
      },
    ]);
  };

  // ================== DÜZENLE (FORM'A AKTAR) ==================
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      lastName: item.lastName,
      companyName: item.companyName,
      contact: item.contact,
      // Sunucudan referenceTypeId doğrudan geliyor varsayımı
      // (Eğer sadece referenceType nesnesi geliyorsa: item.referenceType?.id)
      referenceTypeId: item.referenceTypeId,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

  // ================== FLATLIST ITEM RENDER ==================
  const renderReferenceItem = ({ item }) => {
    // Referans tipi adını bulmak için referenceTypes listesinde eşleştirme yapıyoruz.
    // Sunucu item.referenceType dönüyor mu? Dönmüyorsa item.referenceTypeId üzerinden buluruz.
    const foundType = referenceTypes.find((rt) => rt.id === item.referenceTypeId);
    const displayType = foundType ? foundType.type : "Atanmamış";

    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>
            {item.name} {item.lastName}
          </Text>
          <Text>{item.companyName}</Text>
          <Text>{item.contact}</Text>
          <Text>Tip: {displayType}</Text>
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

  if (!effectiveResumeId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Hata: Resume ID bulunamadı. Lütfen geçerli parametre gönderildiğinden emin olun.
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

      {/* Referans Listesi */}
      <FlatList
        data={referencesData}
        renderItem={renderReferenceItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
      />

      {/* Ekle / Düzenle Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Referans Düzenle" : "Yeni Referans Ekle"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ad"
              value={form.name}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Soyad"
              value={form.lastName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, lastName: text }))
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

            <TextInput
              style={styles.input}
              placeholder="İletişim (Tel/Email)"
              value={form.contact}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, contact: text }))
              }
            />

            {/* Referans Tipi Seçimi */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.referenceTypeId}
                onValueChange={(itemValue) =>
                  setForm((prev) => ({ ...prev, referenceTypeId: itemValue }))
                }
              >
                <Picker.Item label="-- Referans Tipi Seçin --" value={null} />
                {referenceTypes.map((rt) => (
                  <Picker.Item key={rt.id} label={rt.type} value={rt.id} />
                ))}
              </Picker>
            </View>

            {/* Kaydet & İptal Butonları */}
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

export default References;

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
