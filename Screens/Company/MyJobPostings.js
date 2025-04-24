// Screens/Company/MyJobPostings.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect, StackActions } from "@react-navigation/native";
import { GetRealApi } from "../../Components/ApiService";
import { MaterialIcons } from "@expo/vector-icons";

const MyJobPostings = () => {
  const navigation = useNavigation();
  const [jobPostings, setJobPostings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [enums, setEnums] = useState([]);
  const [workingAreasList, setWorkingAreasList] = useState([]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    (async () => {
      const e = await GetRealApi("Enums", navigation);
      setEnums(Array.isArray(e) ? e : []);
      const wa = await GetRealApi("WorkingArea", navigation);
      setWorkingAreasList(Array.isArray(wa) ? wa : []);
    })();
  }, [navigation]);

  const fetchJobPostings = async () => {
    setLoading(true);
    const resp = await GetRealApi("MyJobPosting", navigation);
    const list = Array.isArray(resp) ? resp : [];
    setJobPostings(list);
    setFiltered(list);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobPostings();
    }, [navigation])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobPostings().finally(() => setRefreshing(false));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setFiltered(jobPostings);
    } else {
      setFiltered(
        jobPostings.filter((item) =>
          `${item.title} ${item.description}`.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const getEnumText = (enumName, value) => {
    const e = enums.find((x) => x.enumName === enumName);
    return e?.enumList.find((y) => y.value === value)?.text || String(value);
  };

  const openDetail = async (id) => {
    setDetailLoading(true);
    const resp = await GetRealApi(`MyJobPosting/${id}`, navigation);
    setSelectedJob(resp);
    setDetailLoading(false);
    setShowDetailModal(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.label}>Başlık</Text>
      <Text style={styles.value}>{item.title}</Text>

      <Text style={styles.label}>Açıklama</Text>
      <Text style={styles.value}>{item.description}</Text>

      <Text style={styles.label}>Çalışma Alanları</Text>
      <Text style={styles.value}>
        {item.workingAreaList
          ?.map((id) => workingAreasList.find((w) => w.id === id)?.name)
          .filter(Boolean)
          .join(", ")}
      </Text>

      <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => openDetail(item.id)} style={styles.iconButton}>
          <MaterialIcons name="info" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("MyJobPostingCreate", { id: item.id })}
          style={styles.iconButton}
        >
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {/* TODO: silme */}} style={styles.iconButton}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.fullPage}>
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrele..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.dispatch(StackActions.push("MyJobPostingCreate"))}
        >
          <Text style={styles.addBtnText}>EKLE</Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz iş ilanı yok.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
         	renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {detailLoading ? (
              <ActivityIndicator size="large" color="#10B981" />
            ) : (
              <ScrollView>
                <Text style={styles.title}>İlan Detayları</Text>
                {selectedJob && (
                  <>
                    <Text style={styles.label}>Başlık</Text>
                    <Text style={styles.value}>{selectedJob.title}</Text>

                    <Text style={styles.label}>Açıklama</Text>
                    <Text style={styles.value}>{selectedJob.description}</Text>

                    <Text style={styles.label}>Çalışma Alanları</Text>
                    <Text style={styles.value}>
                      {selectedJob.workingAreaList
                        ?.map((id) => workingAreasList.find((w) => w.id === id)?.name)
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                  </>
                )}
              </ScrollView>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowDetailModal(false)}>
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyJobPostings;

const styles = StyleSheet.create({
  fullPage: { flex: 1, backgroundColor: "#f5faff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "#fff" },
  searchInput: { flex: 1, backgroundColor: "#d1d5db", padding: 8, borderRadius: 8, marginRight: 8 },
  addBtn: { backgroundColor: "#10B981", padding: 10, borderRadius: 8 },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  listContainer: { padding: 8, paddingBottom: 64 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 32 },
  emptyText: { fontSize: 16, color: "#6b7280" },
  cardContainer: {
    backgroundColor: "#fff",
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginTop: 8 },
  value: { fontSize: 14, color: "#1f2937", marginBottom: 4 },
  iconRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  iconButton: { marginLeft: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: { backgroundColor: "#fff", borderRadius: 8, maxHeight: "80%", padding: 16 },
  closeBtn: { marginTop: 12, backgroundColor: "#EF4444", padding: 10, borderRadius: 6, alignItems: "center" },
  closeText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 16, textAlign: "center" },
});
