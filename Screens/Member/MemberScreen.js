import React, { useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { GetRealApi } from "../../Components/ApiService";
import AddMember from "./AddMember";
import MemberDetail from "./MemberDetail";

const MemberScreen = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchMemberData = async () => {
    setLoading(true);

    // GET => /api/Resume/myResumeData
    const response = await GetRealApi("Resume/myResumeData", navigation);
    // Eğer 404 veya herhangi bir nedenden ötürü null dönerse:
    if (!response) {
      setMember(null);
    } else {
      setMember(response);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMemberData();
    }, [navigation])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Veri yoksa form göster
  if (!member) {
    return <AddMember />;
  }

  // Veri varsa detay sayfası
  return <MemberDetail member={member} />;
};

export default MemberScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
