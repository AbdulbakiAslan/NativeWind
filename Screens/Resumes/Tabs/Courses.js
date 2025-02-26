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
  const { resume } = props;
  const effectiveResumeId = resume?.id;

  if (!effectiveResumeId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Hata: Resume ID bulunamadı. Lütfen geçerli parametre gönderildiğinden
          emin olun.
        </Text>
      </View>
    );
  }

  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    courseName: "",
    courseInfo: "",
  });

  useEffect(() => {
    fetchCourses(effectiveResumeId);
  }, [effectiveResumeId]);

  const fetchCourses = async (id) => {
    try {
      setLoading(true);
      const result = await GetRealApi(`Course?resumeId=${id}`);
      if (Array.isArray(result)) {
        setCoursesData(result.filter((item) => item.resumeId === id));
      }
    } catch (error) {
      console.error("Kurs verileri alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
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

  const handleSubmit = async () => {
    const apiMethod = form.id ? PutRealApi : PostRealApi;
    const endpoint = form.id ? `Course/${form.id}` : "Course";

    const payload = {
      courseName: form.courseName,
      courseInfo: form.courseInfo,
      resumeId: effectiveResumeId,
    };

    console.log("Gönderilen Payload:", payload);

    const result = await apiMethod(endpoint, payload);
    if (result) {
      Alert.alert("Başarılı", "Kurs bilgisi kaydedildi");
      fetchCourses(effectiveResumeId);
      setModalVisible(false);
      setForm({ courseName: "", courseInfo: "" });
    } else {
      Alert.alert("Hata", "İşlem sırasında bir hata oluştu");
    }
  };

  const renderCourseItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.title}>{item.courseName}</Text>
        <Text>{item.courseInfo}</Text>
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
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={coursesData}
        renderItem={renderCourseItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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

            <Button title="Kaydet" onPress={handleSubmit} />
            <Button
              title="İptal"
              color="red"
              onPress={() => {
                setModalVisible(false);
                setForm({ courseName: "", courseInfo: "" });
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
