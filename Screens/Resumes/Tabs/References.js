import React from "react";
import { View, Text, StyleSheet } from "react-native";

const References = (props) => {
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
      <Text style={styles.text}>Referanslar Sekmesi</Text>
      <Text>Resume ID: {resume.id}</Text>
      {/* Referans detaylarını burada gösterebilirsiniz */}
    </View>
  );
};

export default References;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
