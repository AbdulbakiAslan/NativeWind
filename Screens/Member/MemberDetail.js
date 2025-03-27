import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";

const MemberDetail = ({ member }) => {
  // useNavigation hook'u ile navigation nesnesini alıyoruz.
  const navigation = useNavigation();

  const imageSource = member.photoPath
    ? { uri: member.photoPath }
    : require("../../assets/user.png");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Üye Detayları</Text>
      <Image source={imageSource} style={styles.image} />

      <View style={styles.detailContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Oda Sicil Numarası:</Text>
          <Text style={styles.value}>{member.registrationNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>İsim:</Text>
          <Text style={styles.value}>{member.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Soyisim:</Text>
          <Text style={styles.value}>{member.lastName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Doğum Tarihi:</Text>
          <Text style={styles.value}>{new Date(member.birthDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Cinsiyet:</Text>
          <Text style={styles.value}>
            {member.gender === 1
              ? "Kadın"
              : member.gender === 2
              ? "Erkek"
              : "Belirtilmemiş"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Telefon:</Text>
          <Text style={styles.value}>{member.telephone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{member.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Adres:</Text>
          <Text style={styles.value}>{member.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>İlçe:</Text>
          <Text style={styles.value}>{member.district}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>İl:</Text>
          <Text style={styles.value}>{member.province}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Askerlik Durumu:</Text>
          <Text style={styles.value}>
            {member.militaryServiceStatus === 1
              ? "Muaf"
              : member.militaryServiceStatus === 2
              ? "Tecili"
              : member.militaryServiceStatus === 3
              ? "Yapıldı"
              : member.militaryServiceStatus === 4
              ? "Yapılıyor"
              : "Belirtilmemiş"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Sürücü Belgesi:</Text>
          <Text style={styles.value}>
            {member.driversLicenseClass === 1
              ? "A"
              : member.driversLicenseClass === 2
              ? "A1"
              : member.driversLicenseClass === 3
              ? "A2"
              : member.driversLicenseClass === 4
              ? "B"
              : member.driversLicenseClass === 5
              ? "B2"
              : member.driversLicenseClass === 6
              ? "C"
              : member.driversLicenseClass === 7
              ? "D"
              : member.driversLicenseClass === 8
              ? "E"
              : "Belirtilmemiş"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Deneyim Durumu:</Text>
          <Text style={styles.value}>
            {member.experienceStatus === 0
              ? "Deneyimi Yok"
              : member.experienceStatus === 1
              ? "1 Yıl"
              : member.experienceStatus === 2
              ? "2 Yıl"
              : member.experienceStatus === 3
              ? "3 Yıl"
              : member.experienceStatus === 4
              ? "4 Yıl"
              : member.experienceStatus === 5
              ? "5 Yıl"
              : member.experienceStatus === 6
              ? "6 Yıl"
              : member.experienceStatus === 7
              ? "7 Yıl"
              : member.experienceStatus === 8
              ? "8 Yıl"
              : member.experienceStatus === 9
              ? "9 Yıl"
              : member.experienceStatus === 10
              ? "10 Yıl ve Üzeri"
              : "Belirtilmemiş"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>İş Arıyor mu?:</Text>
          <Text style={styles.value}>
            {member.isLookingForJob === true
              ? "Evet"
              : member.isLookingForJob === false
              ? "Hayır"
              : "Belirtilmemiş"}
          </Text>
        </View>
        {member.notes ? (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Notlar:</Text>
            <Text style={styles.value}>{member.notes}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          navigation.navigate("EditMember", { member });
        }}
      >
        <Text style={styles.editButtonText}>Düzenle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    width: 150,
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#777",
    flexWrap: "wrap",
  },
  editButton: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
