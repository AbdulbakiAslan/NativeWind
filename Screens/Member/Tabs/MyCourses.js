// MyCourses.js
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

const MyCourses = () => {
  // Özgeçmiş verisi
  const [resumeData, setResumeData] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  // Kurs listesi
  const [coursesData, setCoursesData] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Modal ve form state
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: null,
    courseName: "",
    courseInfo: "",
    resumeId: null,
  });

  // Sayfa ilk açıldığında özgeçmiş ve kursları çek
  useEffect(() => {
    fetchResumeData();
  }, []);

  // Özgeçmiş verisi çekme
  const fetchResumeData = async () => {
    try {
      setLoadingResume(true);
      // /api/Resume/myResumeData
      const result = await GetRealApi("Resume/myResumeData");
      if (result && result.id) {
        setResumeData(result);
        // Özgeçmiş yüklendikten sonra kursları çek
        fetchCourses();
      }
    } catch (error) {
      console.error("Resume data fetch error:", error);
    } finally {
      setLoadingResume(false);
    }
  };

  // Kursları çekme
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      // /api/Resume/myResumeData/Course
      const result = await GetRealApi("Resume/myResumeData/Course");
      if (Array.isArray(result)) {
        setCoursesData(result);
      }
    } catch (error) {
      console.error("Courses fetch error:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Formu sıfırla
  const resetForm = () => {
    setForm({
      id: null,
      courseName: "",
      courseInfo: "",
      resumeId: resumeData?.id ?? null,
    });
  };

  // Ekle veya Güncelle butonuna basılınca
  const handleSubmit = async () => {
    if (!form.courseName) {
      Alert.alert("Uyarı", "Lütfen kurs adını giriniz.");
      return;
    }
    try {
      // Güncelleme (PUT)
      if (form.id) {
        const payload = {
          id: form.id,
          courseName: form.courseName,
          courseInfo: form.courseInfo,
          resumeId: form.resumeId,
        };
        // /api/MyCourse
        const updated = await PutRealApi("MyCourse", payload);
        if (updated) {
          Alert.alert("Başarılı", "Kurs güncellendi.");
          fetchCourses();
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } 
      // Yeni ekleme (POST)
      else {
        const payload = {
          courseName: form.courseName,
          courseInfo: form.courseInfo,
          resumeId: resumeData?.id,
        };
        // /api/MyCourse
        const created = await PostRealApi("MyCourse", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni kurs eklendi.");
          fetchCourses();
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
            // /api/MyCourse/{id}
            const result = await DeleteRealApi(`MyCourse/${id}`);
            if (result) {
              Alert.alert("Başarılı", "Kayıt silindi.");
              fetchCourses();
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

  // Düzenleme butonuna tıklandığında
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      courseName: item.courseName,
      courseInfo: item.courseInfo,
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

  if (loadingCourses) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Liste öğesini çizme
  const renderCourseItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemTitle}>{item.courseName}</Text>
        <Text>{item.courseInfo}</Text>
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

  // Arayüz
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

      {/* Kurs Listesi */}
      {coursesData.length === 0 ? (
        <Text style={{ textAlign: "center", marginVertical: 8 }}>
          Henüz bir kurs eklenmemiş.
        </Text>
      ) : (
        <FlatList
          data={coursesData}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id?.toString()}
        />
      )}

      {/* Modal (Ekle/Düzenle Formu) */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Kurs Düzenle" : "Yeni Kurs Ekle"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Kurs Adı"
              value={form.courseName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, courseName: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Kurs Bilgisi"
              value={form.courseInfo}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, courseInfo: text }))
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

export default MyCourses;

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
