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
  DeleteRealApi,
  PostRealApi,
  PutRealApi,
} from "../../../Components/ApiService";

const Courses = (props) => {
  // Props'tan gelen resume bilgisi (örnek: { id: 123, ... })
  const { resume } = props;
  const effectiveResumeId = resume?.id;

  // Eğer geçerli bir resumeId yoksa uyarı göster
  if (!effectiveResumeId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Hata: Resume ID bulunamadı. Lütfen geçerli parametre gönderildiğinden emin olun.
        </Text>
      </View>
    );
  }

  // State tanımlamaları
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Formda kullanacağımız alanlar
  const [form, setForm] = useState({
    id: null,         // Düzenleme esnasında kullanacağız
    courseName: "",
    courseInfo: "",
  });

  // Sayfa yüklendiğinde veya effectiveResumeId değiştiğinde kursları çek
  useEffect(() => {
    fetchCourses(effectiveResumeId);
  }, [effectiveResumeId]);

  // Kursları API'den çeken fonksiyon
  const fetchCourses = async (id) => {
    try {
      setLoading(true);
      // GET /api/Course?resumeId={id}
      const result = await GetRealApi(`Course?resumeId=${id}`);
      // Dönen sonuç bir dizi ise state'e atıyoruz
      if (Array.isArray(result)) {
        // Filtrelemeye gerek kalmayabilir, ama yine de emin olmak için:
        setCoursesData(result.filter((item) => item.resumeId === id));
      }
    } catch (error) {
      console.error("Kurs verileri alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Silme işlemi
  const handleDelete = async (courseId) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          // DELETE /api/Course/{courseId}
          const result = await DeleteRealApi(`Course/${courseId}`);
          if (result) {
            Alert.alert("Başarılı", "Kurs bilgisi silindi");
            fetchCourses(effectiveResumeId);
          } else {
            Alert.alert("Hata", "Silme işlemi başarısız oldu");
          }
        },
      },
    ]);
  };

  // Yeni kurs ekleme veya mevcut kurs güncelleme
  const handleSubmit = async () => {
    // Eğer form.id varsa -> güncelleme, yoksa -> ekleme
    if (form.id) {
      // PUT /api/Course
      const payload = {
        id: form.id,
        courseName: form.courseName,
        courseInfo: form.courseInfo,
        resumeId: effectiveResumeId,
      };
      const result = await PutRealApi("Course", payload);
      if (result) {
        Alert.alert("Başarılı", "Kurs bilgisi güncellendi");
        setModalVisible(false);
        fetchCourses(effectiveResumeId);
        resetForm();
      } else {
        Alert.alert("Hata", "Güncelleme sırasında bir hata oluştu");
      }
    } else {
      // POST /api/Course
      const payload = {
        courseName: form.courseName,
        courseInfo: form.courseInfo,
        resumeId: effectiveResumeId,
      };
      const result = await PostRealApi("Course", payload);
      if (result) {
        Alert.alert("Başarılı", "Kurs bilgisi eklendi");
        setModalVisible(false);
        fetchCourses(effectiveResumeId);
        resetForm();
      } else {
        Alert.alert("Hata", "Ekleme sırasında bir hata oluştu");
      }
    }
  };

  // Düzenleme butonuna tıklandığında formu doldurup modal açma
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      courseName: item.courseName,
      courseInfo: item.courseInfo,
    });
    setModalVisible(true);
  };

  // Modal kapatırken formu sıfırlayalım
  const resetForm = () => {
    setForm({ id: null, courseName: "", courseInfo: "" });
  };

  // FlatList içerisinde her bir kursun render edilmesi
  const renderCourseItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.title}>{item.courseName}</Text>
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

  // Yüklenme göstergesi
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Asıl arayüz
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
        data={coursesData}
        renderItem={renderCourseItem}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
      />

      {/* Ekle/Güncelle Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Kurs Adı"
              value={form.courseName}
              onChangeText={(text) => setForm((prev) => ({ ...prev, courseName: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Kurs Bilgisi"
              value={form.courseInfo}
              onChangeText={(text) => setForm((prev) => ({ ...prev, courseInfo: text }))}
            />

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

export default Courses;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row", gap: 8 },
  addButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});
