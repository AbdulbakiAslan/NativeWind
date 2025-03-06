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

// API fonksiyonlarınız
import {
  GetRealApi,
  PostRealApi,
  PutRealApi,
  DeleteRealApi,
} from "../../../Components/ApiService";

const ComputerSkills = ({ resume }) => {
  const effectiveResumeId = resume?.id;

  // Resume ID yoksa uyarı
  if (!effectiveResumeId) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>
          Hata: Resume ID bulunamadı. Lütfen geçerli parametre gönderildiğinden emin olun.
        </Text>
      </View>
    );
  }

  // Sunucudan gelen bilgisayar becerisi kayıtları
  // Ör: [{ id:2, computerSkillType:"ReactNative", level:"***", resumeId:1 }, ...]
  const [computerSkillsData, setComputerSkillsData] = useState([]);
  // Bilgisayar becerisi türleri
  // Ör: [{ id:4, text:"Excel" }, { id:5, text:"Sap2000" }, ...]
  const [computerSkillTypes, setComputerSkillTypes] = useState([]);
  // Yükleniyor mu?
  const [loading, setLoading] = useState(false);
  // Modal görünürlük
  const [modalVisible, setModalVisible] = useState(false);

  // Form state (ekleme / düzenleme)
  // Burada, sunucu POST/PUT'ta "computerSkillTypeId" (int) ve "level" (int) bekliyor.
  const [form, setForm] = useState({
    id: null,                   // Kayıt ID'si (düzenleme varsa)
    computerSkillTypeId: null, // Seçilen beceri türünün ID'si
    level: null,               // Seviye (1-5) integer
    resumeId: effectiveResumeId,
  });

  // 1-5 arası integer değerleri Picker’da göstermek için
  const levelOptions = [
    { label: "* (1)", value: 1 },
    { label: "** (2)", value: 2 },
    { label: "*** (3)", value: 3 },
    { label: "**** (4)", value: 4 },
    { label: "***** (5)", value: 5 },
  ];

  useEffect(() => {
    fetchComputerSkills(effectiveResumeId);
    fetchComputerSkillTypes();
  }, [effectiveResumeId]);

  // ================== Bilgisayar Becerilerini Çek (GET) ==================
  const fetchComputerSkills = async (resumeId) => {
    try {
      setLoading(true);
      // GET /api/ComputerSkill?resumeId=1
      // Örnek cevap: 
      // [
      //   { "id":2, "computerSkillType":"ReactNative", "level":"***", "resumeId":1 },
      //   { "id":3, "computerSkillType":"Excel",       "level":"***", "resumeId":1 },
      //   ...
      // ]
      const result = await GetRealApi(`ComputerSkill?resumeId=${resumeId}`);
      if (Array.isArray(result)) {
        // Yalnızca ilgili resumeId'ye ait kayıtları filtrele
        setComputerSkillsData(result.filter((item) => item.resumeId == resumeId));
      } else {
        console.warn("API'den bilgisayar becerisi verisi boş veya hatalı döndü.");
      }
    } catch (error) {
      console.error("Bilgisayar becerileri çekilirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================== Bilgisayar Becerisi Türlerini Çek (GET) ==================
  const fetchComputerSkillTypes = async () => {
    try {
      // GET /api/ComputerSkillType
      // Örnek cevap:
      // [ { "id":4, "text":"Excel" }, { "id":5, "text":"Sap2000" }, { "id":6, "text":"ReactNative" }, ... ]
      const result = await GetRealApi("ComputerSkillType");
      if (Array.isArray(result)) {
        setComputerSkillTypes(result);
      }
    } catch (error) {
      console.error("Bilgisayar becerisi türleri çekilirken hata:", error);
    }
  };

  // ================== Formu Sıfırla ==================
  const resetForm = () => {
    setForm({
      id: null,
      computerSkillTypeId: null,
      level: null,
      resumeId: effectiveResumeId,
    });
  };

  // ================== Ekleme / Güncelleme (POST / PUT) ==================
  const handleSubmit = async () => {
    if (!form.computerSkillTypeId) {
      Alert.alert("Uyarı", "Lütfen bir beceri türü seçin.");
      return;
    }
    if (!form.level) {
      Alert.alert("Uyarı", "Lütfen bir seviye seçin.");
      return;
    }

    // Sunucu PUT/POST'ta { id, computerSkillTypeId, level, resumeId } bekliyor (level integer)
    try {
      if (form.id) {
        // Güncelleme (PUT /api/ComputerSkill)
        // { "id": 2, "computerSkillTypeId": 4, "level": 5, "resumeId": 1 }
        const payload = {
          id: form.id,
          computerSkillTypeId: form.computerSkillTypeId,
          level: form.level,
          resumeId: form.resumeId,
        };
        console.log("PUT isteğiyle gönderilecek veri:", payload);

        const updated = await PutRealApi("ComputerSkill", payload);
        if (updated) {
          Alert.alert("Başarılı", "Bilgisayar becerisi güncellendi.");
          fetchComputerSkills(effectiveResumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Güncelleme sırasında hata oluştu.");
        }
      } else {
        // Ekleme (POST /api/ComputerSkill)
        // { "computerSkillTypeId":4, "level":5, "resumeId":1 }
        const payload = {
          computerSkillTypeId: form.computerSkillTypeId,
          level: form.level,
          resumeId: form.resumeId,
        };
        console.log("POST isteğiyle gönderilecek veri:", payload);

        const created = await PostRealApi("ComputerSkill", payload);
        if (created) {
          Alert.alert("Başarılı", "Yeni bilgisayar becerisi eklendi.");
          fetchComputerSkills(effectiveResumeId);
          setModalVisible(false);
          resetForm();
        } else {
          Alert.alert("Hata", "Ekleme sırasında hata oluştu.");
        }
      }
    } catch (error) {
      console.error("Bilgisayar becerisi kaydı hatası:", error);
      Alert.alert("Hata", "Beklenmedik bir hata oluştu.");
    }
  };

  // ================== Silme (DELETE) ==================
  const handleDelete = (skillId) => {
    Alert.alert(
      "Silme Onayı",
      "Bu bilgisayar becerisini silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await DeleteRealApi(`ComputerSkill/${skillId}`);
              if (result) {
                Alert.alert("Başarılı", "Bilgisayar becerisi silindi.");
                fetchComputerSkills(effectiveResumeId);
              } else {
                Alert.alert("Hata", "Silme işlemi başarısız oldu.");
              }
            } catch (error) {
              console.error("Bilgisayar becerisi silme hatası:", error);
            }
          },
        },
      ]
    );
  };

  // ================== Düzenleme (Form'a Aktar) ==================
  const handleEdit = (item) => {
    // item = { id:2, computerSkillType:"ReactNative", level:"***", resumeId:1 }
    // Sunucu PUT/POST'ta ID bekliyor: "computerSkillTypeId"
    // Dolayısıyla "ReactNative" metninin ID'sini bulmamız gerek:
    const matchedType = computerSkillTypes.find(
      (t) => t.text === item.computerSkillType
    );
    const foundId = matchedType ? matchedType.id : null;

    // Seviye "level": "*****" (yıldız string) veya integer gelebilir.
    // Sunucuya integer göndermemiz lazım (ör. 5).
    // Yıldız sayısını parse etmek için basit bir yöntem:
    // (Eğer sunucu "3" döndürüyorsa parseInt yeterli)
    // (Eğer "****" döndürüyorsa length alıp parseInt'e çevirmek gerek)
    let numericLevel = parseInt(item.level, 10);
    if (isNaN(numericLevel)) {
      // Örneğin "****" => length=4 => seviye=4
      numericLevel = item.level ? item.level.length : 0;
    }

    setForm({
      id: item.id,
      computerSkillTypeId: foundId,
      level: numericLevel,
      resumeId: item.resumeId,
    });
    setModalVisible(true);
  };

  // ================== Listelemede Seviye Gösterimi ==================
  // Sunucu "level" alanını "*****" gibi bir metin veya integer olarak döndürebilir.
  // Bu fonksiyon, hem metin hem sayı durumunu destekliyor.
  const getStars = (val) => {
    // 1) Eğer val integer ise, parseInt ile yıldız sayısını tekrarlar
    // 2) Eğer val "****" gibi bir string ise direkt dönebilir
    // 3) Veya karışık durumlarda unify edebiliriz
    if (!val) return "";

    // Eğer sunucu "level": "***" dönüyorsa:
    if (typeof val === "string" && val.includes("*")) {
      return val; // "***" gibi
    }

    // Eğer sunucu integer dönüyorsa (ör. 3) veya string "3"
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      return "★".repeat(num);
    }

    // Diğer durumlarda boş döndür
    return "";
  };

  // ================== FlatList Item Render ==================
  const renderSkillItem = ({ item }) => {
    // item.computerSkillType -> "Excel" vb. (metin)
    // Eşleştirme: "Excel" -> ID=4
    // Tersini yapmaya gerek yok; sadece ekranda "Excel" göstermek yeterli
    // Ama isterseniz ID ile de eşleştirebilirsiniz:
    // const matchedType = computerSkillTypes.find(t => t.text === item.computerSkillType);
    // const skillName = matchedType ? matchedType.text : item.computerSkillType;
    // Bu senaryoda item.computerSkillType metnini doğrudan gösteriyoruz:
    const skillName = item.computerSkillType || "Bilinmeyen Beceri";
    const levelStars = getStars(item.level);

    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>{skillName}</Text>
          <Text>Seviye: {levelStars}</Text>
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

  // ================== Render ==================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* + Ekle Butonu */}
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
        data={computerSkillsData}
        renderItem={renderSkillItem}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
      />

      {/* Modal: Ekle / Düzenle */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {form.id ? "Bilgisayar Becerisi Düzenle" : "Yeni Bilgisayar Becerisi Ekle"}
            </Text>

            {/* Beceri Türü */}
            <Text style={styles.label}>Beceri Türü:</Text>
            <Picker
              selectedValue={form.computerSkillTypeId}
              style={styles.picker}
              onValueChange={(val) => setForm((prev) => ({ ...prev, computerSkillTypeId: val }))}
            >
              <Picker.Item label="Seçiniz..." value={null} />
              {computerSkillTypes.map((type) => (
                <Picker.Item key={type.id} label={type.text} value={type.id} />
              ))}
            </Picker>

            {/* Seviye */}
            <Text style={styles.label}>Seviye (1 - 5):</Text>
            <Picker
              selectedValue={form.level}
              style={styles.picker}
              onValueChange={(val) => setForm((prev) => ({ ...prev, level: val }))}
            >
              <Picker.Item label="Seçiniz..." value={null} />
              {levelOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>

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

export default ComputerSkills;

// ================== Stiller ==================
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
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12 },
  picker: { marginVertical: 8, backgroundColor: "#fff" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
