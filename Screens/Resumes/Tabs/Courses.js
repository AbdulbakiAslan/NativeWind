import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

const Courses = () => {
  const route = useRoute();
  const { resume } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kurslar Sekmesi</Text>
      {/* Örnek: <Text>{JSON.stringify(resume)}</Text> */}
    </View>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
