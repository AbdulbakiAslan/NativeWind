// Navigator.js
import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from "react-native";

// API servisi
import { GetRealApi } from "../../Components/ApiService";
import { checkToken } from "../../Components/utils";

// Ekranlar
import { HomeScreen } from "../Home/HomeScreen";
import UsersScreen from "../Users/UsersScreen";
import CompaniesScreen from "../Companies/CompaniesScreen";
import JobPostingList from "../Company/JobPostingList";
import MemberScreen from "../Member/MemberScreen";
import CompanyScreen from "../Company/CompanyScreen";
import { ResumesScreen } from "../Resumes/ResumesScreen";
import AddResume from "../Resumes/AddResume";
import ResumeDetail from "../Resumes/ResumeDetail";
import EditResumeTabs from "../Resumes/Tabs/EditResumeTabs";
import { ProfileDetail } from "../Profiles/ProfileDetail";  // Adjusted to named import
import { AddProfile } from "../Profiles/AddProfile";        // Adjusted to named import
import AddUser from "../Users/AddUser";
import EditUserTabs from "../Users/Tabs/EditUserTabs";
import MemberDetail from "../Member/MemberDetail";
import AddMember from "../Member/AddMember";
import EditMemberTabs from "../Member/Tabs/EditMemberTabs";

const Drawer = createDrawerNavigator();

export function MyDrawer({ setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    (async () => {
      const tokenValid = await checkToken();
      if (!tokenValid) {
        console.warn("Token süresi dolmuş, kullanıcı çıkış yapıyor...");
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
        return;
      }

      const dummyNavigation = { dispatch: () => {} };
      const userData = await GetRealApi("GetMyUserData", dummyNavigation);

      if (userData?.roles?.length) {
        const roles = userData.roles.map(r => r.toLowerCase().trim());
        if (roles.includes("admin")) setRole("admin");
        else if (roles.includes("member")) setRole("member");
        else setRole(roles[0]);
      }

      setIsLoading(false);
    })();
  }, [setIsLoggedIn]);

  if (isLoading || role === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const initialRoute =
    role === "admin" ? "Home" : role === "member" ? "MemberScreen" : role === "company" ? "CompanyScreen" : "Home";

  return (
    <Drawer.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: { backgroundColor: "#ff0000" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => <ExitButton setIsLoggedIn={setIsLoggedIn} />,
      }}
    >
      {role === "admin" && (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} options={{ drawerLabel: 'Panel' }} />
          <Drawer.Screen name="UsersScreen" component={UsersScreen} options={{ drawerLabel: 'Kullanıcılar' }} />
          <Drawer.Screen name="ResumesScreen" component={ResumesScreen} options={{ drawerLabel: 'Özgeçmişler' }} />
          <Drawer.Screen name="CompaniesScreen" component={CompaniesScreen} options={{ drawerLabel: 'Şirketler' }} />
          <Drawer.Screen name="JobPostingList" component={JobPostingList} options={{ drawerLabel: 'İş İlanları' }} />
        </>
      )}

      {role === "member" && (
        <Drawer.Screen name="MemberScreen" component={MemberScreen} options={{ drawerLabel: 'Profil' }} />
      )}

      {role === "company" && (
        <>
          <Drawer.Screen name="CompanyScreen" component={CompanyScreen} options={{ drawerLabel: 'Firma' }} />
          <Drawer.Screen name="JobPostingList" component={JobPostingList} options={{ drawerLabel: 'İş İlanları' }} />
        </>
      )}

      {/* Gizli sayfalar */}
      <Drawer.Screen name="ProfileDetail" component={ProfileDetail} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="AddProfile" component={AddProfile} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="AddResume" component={AddResume} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="ResumeDetail" component={ResumeDetail} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="EditResume" component={EditResumeTabs} options={{ drawerItemStyle: { display: "none" }, unmountOnBlur: true }} />
      <Drawer.Screen name="AddUser" component={AddUser} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="EditUser" component={EditUserTabs} options={{ drawerItemStyle: { display: "none" }, unmountOnBlur: true }} />
      <Drawer.Screen name="MemberDetail" component={MemberDetail} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="AddMember" component={AddMember} options={{ drawerItemStyle: { display: "none" }, unmountOnBlur: true }} />
      <Drawer.Screen name="EditMember" component={EditMemberTabs} options={{ drawerItemStyle: { display: "none" }, unmountOnBlur: true }} />
    </Drawer.Navigator>
  );
}

const ExitButton = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.exitButton}>
      <Text style={styles.exitText}>Çıkış Yap</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exitButton: { marginRight: 15, padding: 8, backgroundColor: "black", borderRadius: 5 },
  exitText: { color: "white", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" }
});

export default MyDrawer;
