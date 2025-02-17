import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const EducationInfo = () => {
  const route = useRoute();
  const { resume } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Eğitim Bilgileri Sekmesi</Text>
      {/* Örnek: <Text>{JSON.stringify(resume)}</Text> */}
    </View>
  );
};

export default EducationInfo;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
