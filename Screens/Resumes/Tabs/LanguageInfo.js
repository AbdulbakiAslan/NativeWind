import React from "react";
import { View, Text } from "react-native";

const LanguageInfo = (props) => {
  // useRoute() yerine props üzerinden resume bilgisini alıyoruz
  const { resume } = props;

  if (!resume) {
    return (
      <View>
        <Text>Resume verisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Resume ID: {resume.id}</Text>
      <Text>{resume.name} için dil bilgileri burada gösterilecek.</Text>
      {/* Diğer dil bilgisi elemanlarınız */}
    </View>
  );
};

export default LanguageInfo;
