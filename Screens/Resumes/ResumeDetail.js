// ResumeDetail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { GetRealApi } from "../../Components/ApiService";

export const ResumeDetail = () => {
  const route = useRoute();
  // Parametre olarak resumeId bekliyoruz.
  const { resumeId } = route.params;
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeDetail = async () => {
      setLoading(true);
      try {
        // API URL'si: /api/Resume/{Id}
        const data = await GetRealApi(`Resume/${resumeId}`);
        if (data) {
          setResume(data);
        } else {
          setResume(null);
        }
      } catch (error) {
        console.error("Özgeçmiş detay alınırken hata:", error);
        setResume(null);
      }
      setLoading(false);
    };

    fetchResumeDetail();
  }, [resumeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!resume) {
    return (
      <View style={styles.container}>
        <Text>Özgeçmiş verisi bulunamadı.</Text>
      </View>
    );
  }

  // Yardımcı fonksiyonlar: Sayısal değerleri okunabilir metinlere çevirir.
  const getGender = (gender) => {
    if (gender === 1) return "Kadın";
    if (gender === 2) return "Erkek";
    return "Bilinmiyor";
  };

  const getMilitaryStatus = (status) => {
    switch (status) {
      case 1:
        return "Muaf";
      case 2:
        return "Tecili";
      case 3:
        return "Yapıldı";
      case 4:
        return "Yapılıyor";
      default:
        return "Bilinmiyor";
    }
  };

  const getDriversLicenseClass = (value) => {
    switch (value) {
      case 1:
        return "A";
      case 2:
        return "A1";
      case 3:
        return "A2";
      case 4:
        return "B";
      case 5:
        return "B2";
      case 6:
        return "C";
      case 7:
        return "D";
      case 8:
        return "E";
      default:
        return "Bilinmiyor";
    }
  };

  const getExperienceStatus = (value) => {
    if (value === 0) return "Deneyimi Yok";
    return `${value} Yıl`;
  };

  const getJobSeekingText = (value) => {
    return value ? "Evet" : "Hayır";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Özgeçmiş Detayları</Text>
      {resume.photoPath ? (
        <Image
          source={{
            uri:
              resume.photoPath !== ""
                ? `data:image/png;base64,${resume.photoPath}`
                : "https://via.placeholder.com/160x120.png?text=No+Image",
          }}
          style={styles.image}
        />
      ) : (
        <Image
          source={{
            uri: "https://via.placeholder.com/160x120.png?text=No+Image",
          }}
          style={styles.image}
        />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Oda Sicil Numarası:</Text>
        <Text style={styles.value}>{resume.registrationNumber}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>İsim:</Text>
        <Text style={styles.value}>{resume.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Soyisim:</Text>
        <Text style={styles.value}>{resume.lastName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Doğum Tarihi:</Text>
        <Text style={styles.value}>
          {new Date(resume.birthDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Cinsiyet:</Text>
        <Text style={styles.value}>{getGender(resume.gender)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>{resume.telephone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{resume.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Adres:</Text>
        <Text style={styles.value}>{resume.address}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>İlçe:</Text>
        <Text style={styles.value}>{resume.district}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>İl:</Text>
        <Text style={styles.value}>{resume.province}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Askerlik Durumu:</Text>
        <Text style={styles.value}>
          {getMilitaryStatus(resume.militaryServiceStatus)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Sürücü Belgesi:</Text>
        <Text style={styles.value}>
          {getDriversLicenseClass(resume.driversLicenseClass)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Deneyim:</Text>
        <Text style={styles.value}>
          {getExperienceStatus(resume.experienceStatus)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>İş Arıyor mu:</Text>
        <Text style={styles.value}>
          {getJobSeekingText(resume.isLookingForJob)}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Notlar:</Text>
        <Text style={styles.value}>{resume.notes}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  image: { width: 160, height: 120, borderRadius: 8, marginBottom: 16 },
  infoContainer: { flexDirection: "row", marginBottom: 8, width: "100%" },
  label: { fontWeight: "bold", marginRight: 8, width: 150 },
  value: { flex: 1 },
});

export default ResumeDetail;
