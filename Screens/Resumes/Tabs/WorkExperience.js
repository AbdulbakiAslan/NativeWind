import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkExperience = (props) => {
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
      <Text style={styles.text}>İş Deneyimleri Sekmesi</Text>
      <Text>Resume ID: {resume.id}</Text>
      {/* İş deneyimi bilgilerini burada listeleyebilirsiniz */}
    </View>
  );
};

export default WorkExperience;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
