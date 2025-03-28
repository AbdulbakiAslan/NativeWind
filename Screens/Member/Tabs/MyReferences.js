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

const localReferenceTypes = [
  { id: 1, type: "Kişisel" },
  { id: 2, type: "Profesyonel" },
  { id: 3, type: "Akademik" },
];

const MyReferences = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [referencesData, setReferencesData] = useState([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    lastName: "",
    companyName: "",
    contact: "",
    referenceTypeId: null,
    resumeId: null,
  });

  useEffect(() => {
    fetchResumeData();
  }, []);

  useEffect(() => {
    if (resumeData?.id) {
      fetchReferences();
    }
  }, [resumeData]);

  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
      }
    } catch (error) {
    } finally {
      setLoadingResume(false);
    }
  };

  const fetchReferences = async () => {
    if (!resumeData?.id) {
      return;
    }
    try {
      setLoadingReferences(true);
      const result = await GetRealApi("Resume/myResumeData/Reference");
      if (Array.isArray(result)) {
        setReferencesData(result);
      }
    } catch (error) {
    } finally {
      setLoadingReferences(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      lastName: "",
      companyName: "",
      contact: "",
      referenceTypeId: null,
      resumeId: resumeData?.id ?? null,
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.lastName || !form.referenceTypeId) {
      Alert.alert("Uyarı", "Lütfen Ad, Soyad ve Referans Tipi seçiniz.");
      return;
    }
    try {
      if (form.id) {
        const payload = {
          id: form.id,
          name: form.name,
          lastName: form.lastName,
          companyName: form.companyName,
          contact: form.contact,
          referenceTypeId: form.referenceTypeId,
          resumeId: form.resumeId,
        };
        const updated = await PutRealApi("MyReference", payload);
        if (updated) {
          Alert.alert("Başarılı", "Referans güncellendi.");
          fetchReferences();
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        const payload = {
          name: form.name,
          lastName: form.lastName,
          companyName: form.companyName,
          contact: form.contact,
          referenceTypeId: form.referenceTypeId,
          resumeId: resumeData?.id,
        };
        const created = await PostRealApi("MyReference", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni referans eklendi.");
          fetchReferences();
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  const handleDelete = (referenceId) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await DeleteRealApi(`MyReference/${referenceId}`);
            if (result) {
              Alert.alert("Başarılı", "Referans silindi.");
              fetchReferences();
            } else {
              Alert.alert("Hata", "Silme işlemi başarısız oldu.");
            }
          } catch (error) {
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      lastName: item.lastName,
      companyName: item.companyName,
      contact: item.contact,
      referenceTypeId: item.referenceTypeId,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

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
        <Text style={{ color: "red" }}>Geçerli özgeçmiş bilgisi bulunamadı.</Text>
      </View>
    );
  }

  if (loadingReferences) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderReferenceItem = ({ item }) => {
    const foundType = localReferenceTypes.find((rt) => rt.id === item.referenceTypeId);
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
      {referencesData.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 8 }}>Henüz bir referans eklenmemiş.</Text>
      ) : (
        <FlatList
          data={referencesData}
          renderItem={renderReferenceItem}
          keyExtractor={(item) => item.id?.toString()}
        />
      )}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{form.id ? "Referans Düzenle" : "Yeni Referans Ekle"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Ad"
              value={form.name}
              onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Soyad"
              value={form.lastName}
              onChangeText={(text) => setForm((prev) => ({ ...prev, lastName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Şirket Adı"
              value={form.companyName}
              onChangeText={(text) => setForm((prev) => ({ ...prev, companyName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="İletişim (Tel/Email)"
              value={form.contact}
              onChangeText={(text) => setForm((prev) => ({ ...prev, contact: text }))}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.referenceTypeId}
                onValueChange={(itemValue) => setForm((prev) => ({ ...prev, referenceTypeId: itemValue }))}
              >
                <Picker.Item label="-- Referans Tipi Seçin --" value={null} />
                {localReferenceTypes.map((rt) => (
                  <Picker.Item key={rt.id} label={rt.type} value={rt.id} />
                ))}
              </Picker>
            </View>
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

export default MyReferences;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: { backgroundColor: "#10B981", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  itemContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 8 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 16, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 8 },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 8 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
});
