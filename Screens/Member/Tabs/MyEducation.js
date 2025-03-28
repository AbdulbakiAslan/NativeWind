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

const MyEducation = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [educationData, setEducationData] = useState([]);
  const [loadingEducation, setLoadingEducation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    schoolName: "",
    educationInfo: "",
    startYear: "",
    endYear: "",
    resumeId: null,
  });

  // Sayfa yüklendiğinde önce resume verisini çek
  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      // Resume verisini getir
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
        // Resume yüklendiyse eğitim verilerini çek
        fetchEducation();
      }
    } catch (error) {
      console.error("Resume data fetch error:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  const fetchEducation = async () => {
    try {
      setLoadingEducation(true);
      // Eğitim verilerini getir: courses sayfasındaki gibi "Resume/myResumeData/Education" endpoint'i kullanılıyor
      const result = await GetRealApi("Resume/myResumeData/Education");
      if (Array.isArray(result)) {
        setEducationData(result);
      }
    } catch (error) {
      console.error("Eğitim verileri alınırken hata:", error);
      Alert.alert("Hata", "Veri çekilirken bir hata oluştu!");
    } finally {
      setLoadingEducation(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      schoolName: "",
      educationInfo: "",
      startYear: "",
      endYear: "",
      resumeId: resumeData?.id || null,
    });
  };

  const handleSubmit = async () => {
    if (!form.schoolName) {
      Alert.alert("Uyarı", "Lütfen okul adını giriniz.");
      return;
    }
    try {
      // Güncelleme (PUT) işlemi
      if (form.id) {
        const payload = {
          id: form.id,
          schoolName: form.schoolName,
          educationInfo: form.educationInfo,
          startYear: Number(form.startYear),
          endYear: Number(form.endYear),
          resumeId: form.resumeId,
        };
        const updated = await PutRealApi("MyEducation", payload);
        if (updated) {
          Alert.alert("Başarılı", "Eğitim bilgisi güncellendi.");
          fetchEducation();
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } 
      // Yeni kayıt ekleme (POST) işlemi
      else {
        const payload = {
          schoolName: form.schoolName,
          educationInfo: form.educationInfo,
          startYear: Number(form.startYear),
          endYear: Number(form.endYear),
          resumeId: resumeData?.id,
        };
        const created = await PostRealApi("MyEducation", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni eğitim bilgisi eklendi.");
          fetchEducation();
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

  const handleDelete = (id) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            const result = await DeleteRealApi(`MyEducation/${id}`);
            if (result) {
              Alert.alert("Başarılı", "Kayıt silindi.");
              fetchEducation();
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

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      schoolName: item.schoolName,
      educationInfo: item.educationInfo,
      startYear: item.startYear.toString(),
      endYear: item.endYear.toString(),
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
        <Text>Geçerli özgeçmiş bilgisi bulunamadı.</Text>
      </View>
    );
  }

  if (loadingEducation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderEducationItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemTitle}>{item.schoolName}</Text>
        <Text>{item.educationInfo}</Text>
        <Text>
          {item.startYear} - {item.endYear}
        </Text>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Ekle</Text>
      </TouchableOpacity>

      {educationData.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 8 }}>
          Henüz eğitim bilgisi eklenmemiş.
        </Text>
      ) : (
        <FlatList
          data={educationData}
          renderItem={renderEducationItem}
          keyExtractor={(item) => item.id?.toString()}
        />
      )}

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Eğitim Bilgisi Düzenle" : "Yeni Eğitim Bilgisi Ekle"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Okul Adı"
              value={form.schoolName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, schoolName: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Eğitim Bilgisi"
              value={form.educationInfo}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, educationInfo: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Başlangıç Yılı"
              value={form.startYear}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, startYear: text }))
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Bitiş Yılı"
              value={form.endYear}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, endYear: text }))
              }
              keyboardType="numeric"
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

export default MyEducation;

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
