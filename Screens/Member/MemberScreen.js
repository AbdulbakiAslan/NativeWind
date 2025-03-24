// MemberScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EditMemberTabs from "./Tabs/EditMemberTabs";

const MemberScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <EditMemberTabs />
      </View>
    </View>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  tabsContainer: {
    flex: 1,
  },
});
