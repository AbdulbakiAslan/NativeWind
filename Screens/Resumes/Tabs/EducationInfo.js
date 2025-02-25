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
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  GetRealApi,
  DeleteRealApi,
  PostRealApi,
  PutRealApi,
} from "../../../Components/ApiService";

const EducationInfo = () => {
  const route = useRoute();
  // Sadece route parametrelerinden gelen resume objesini kullanıyoruz
  const resumeFromParams = route.params?.resume;
  // Sadece resume objesinin id'sini alıyoruz; fallback kullanmıyoruz
  const effectiveResumeId = resumeFromParams?.id || route.params?.resumeId;

  // Eğer geçerli resumeId bulunamazsa, hata ekranı gösteriyoruz
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

  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    schoolName: "",
    educationInfo: "",
    startYear: "",
    endYear: "",
  });

  useEffect(() => {
    fetchEducation(effectiveResumeId);
  }, [effectiveResumeId]);

  const fetchEducation = async (id) => {
    try {
      setLoading(true);
      const result = await GetRealApi(`Education?resumeId=${id}`);
      if (Array.isArray(result)) {
        setEducationData(result.filter((item) => item.resumeId === id));
      }
    } catch (error) {
      console.error("Eğitim verileri alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Silme Onayı", "Bu kaydı silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const result = await DeleteRealApi(`Education/${id}`);
          if (result) {
            Alert.alert("Başarılı", "Eğitim bilgisi silindi");
            fetchEducation(effectiveResumeId);
          } else {
            Alert.alert("Hata", "Silme işlemi başarısız oldu");
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    const apiMethod = form.id ? PutRealApi : PostRealApi;
    const endpoint = form.id ? `Education/${form.id}` : "Education";
    const payload = {
      schoolName: form.schoolName,
      educationInfo: form.educationInfo,
      startYear: Number(form.startYear),
      endYear: Number(form.endYear),
      resumeId: effectiveResumeId, // Geçerli resumeId gönderiliyor
    };

    console.log("Gönderilen Payload:", payload);

    const result = await apiMethod(endpoint, payload);
    if (result) {
      Alert.alert("Başarılı", "Eğitim bilgisi kaydedildi");
      fetchEducation(effectiveResumeId);
      setModalVisible(false);
      setForm({
        schoolName: "",
        educationInfo: "",
        startYear: "",
        endYear: "",
      });
    } else {
      Alert.alert("Hata", "İşlem sırasında bir hata oluştu");
    }
  };

  const renderEducationItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.title}>{item.schoolName}</Text>
        <Text>{item.educationInfo}</Text>
        <Text>{`${item.startYear} - ${item.endYear}`}</Text>
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
        data={educationData}
        renderItem={renderEducationItem}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
              value={form.startYear.toString()}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, startYear: text }))
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Bitiş Yılı"
              value={form.endYear.toString()}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, endYear: text }))
              }
              keyboardType="numeric"
            />

            <Button title="Kaydet" onPress={handleSubmit} />
            <Button
              title="İptal"
              color="red"
              onPress={() => {
                setModalVisible(false);
                setForm({
                  schoolName: "",
                  educationInfo: "",
                  startYear: "",
                  endYear: "",
                });
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

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

export default EducationInfo;
