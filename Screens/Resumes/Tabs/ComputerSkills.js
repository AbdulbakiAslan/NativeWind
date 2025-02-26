import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ComputerSkills = (props) => {
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
      <Text style={styles.text}>Bilgisayar Becerileri Sekmesi</Text>
      <Text>Resume ID: {resume.id}</Text>
      {/* İlgili bilgisayar becerilerini burada listeleyebilirsiniz */}
    </View>
  );
};

export default ComputerSkills;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 16, fontWeight: "bold" },
});
