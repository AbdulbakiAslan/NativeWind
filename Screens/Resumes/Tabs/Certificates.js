import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Certificates = (props) => {
  const { resume } = props;

  if (!resume) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Resume verisi eksik.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sertifikalar Sekmesi</Text>
      <Text>Resume ID: {resume.id}</Text>
      {/* İstenirse resume verisi burada detaylandırılabilir */}
    </View>
  );
};

export default Certificates;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
