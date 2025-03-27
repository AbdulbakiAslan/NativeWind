import React, { useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// API fonksiyonumuz
import { GetRealApi } from "../../Components/ApiService";

// Yönlendireceğimiz bileşenler
import AddMember from "./AddMember";
import MemberDetail from "./MemberDetail";

const MemberScreen = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchMemberData = async () => {
    setLoading(true);
    const response = await GetRealApi("Resume/myResumeData", navigation);
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

  if (!member) {
    return <AddMember />;
  }

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
