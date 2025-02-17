import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const WorkExperience = () => {
  const route = useRoute();
  const { resume } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>İş Deneyimleri Sekmesi</Text>
      {/* Örnek: <Text>{JSON.stringify(resume)}</Text> */}
    </View>
  );
};

export default WorkExperience;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
