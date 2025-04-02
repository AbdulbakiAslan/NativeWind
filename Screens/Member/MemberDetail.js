import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";

const MemberDetail = ({ member }) => {
  const navigation = useNavigation();

  const imageSource = member.photoPath
    ? { uri: member.photoPath }
    : require("../../assets/user.png");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Üye Detayları</Text>
      <Image source={imageSource} style={styles.image} />

      <View style={styles.detailContainer}>
        {/* Örnek alanlar */}
        <DetailRow label="Oda Sicil Numarası" value={member.registrationNumber} />
        <DetailRow label="İsim" value={member.name} />
        <DetailRow label="Soyisim" value={member.lastName} />
        <DetailRow
          label="Doğum Tarihi"
          value={new Date(member.birthDate).toLocaleDateString()}
        />
        <DetailRow label="Cinsiyet" value={member.gender === 1 ? "Kadın" : member.gender === 2 ? "Erkek" : "Belirtilmemiş"} />
        <DetailRow label="Telefon" value={member.telephone} />
        <DetailRow label="Email" value={member.email} />
        <DetailRow label="Adres" value={member.address} />
        <DetailRow label="İlçe" value={member.district} />
        <DetailRow label="İl" value={member.province} />
        <DetailRow label="Askerlik Durumu" value={String(member.militaryServiceStatus)} />
        <DetailRow label="Sürücü Belgesi" value={String(member.driversLicenseClass)} />
        <DetailRow label="Deneyim" value={String(member.experienceStatus)} />
        <DetailRow label="İş Arıyor mu?" value={member.isLookingForJob ? "Evet" : "Hayır"} />
        <DetailRow label="İş Arama Mailine Cevap" value={member.isAnsweredLookingForJobMail ? "Evet" : "Hayır"} />
        <DetailRow label="Notlar" value={member.notes} />
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          // Düzenleme ekranına yönlendirme (varsa)
          navigation.navigate("EditMember", { member });
        }}
      >
        <Text style={styles.editButtonText}>Düzenle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Yardımcı küçük bileşen:
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default MemberDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  detailContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    width: 180,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#777",
  },
  editButton: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
