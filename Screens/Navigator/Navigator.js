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
import { ProfileScreen } from "../Profiles/ProfileScreen";
import { ProfileDetail } from "../Profiles/ProfileDetail";
import { AddProfile } from "../Profiles/AddProfile";
import { ResumesScreen } from "../Resumes/ResumesScreen";
import { AddResume } from "../Resumes/AddResume";
import { ResumeDetail } from "../Resumes/ResumeDetail";
import EditResumeTabs from "../Resumes/Tabs/EditResumeTabs";
import UsersScreen from "../Users/UsersScreen";
import EditUserTabs from "../Users/Tabs/EditUserTabs";
import AddUser from "../Users/AddUser";
import MemberScreen from "../Member/MemberScreen";
import EditMemberTabs from "../Member/Tabs/EditMemberTabs";
import MemberDetail from "../Member/MemberDetail";
import AddMember from "../Member/AddMember";
import CompanyScreen from "../Company/CompanyScreen";
import JobPostingList from "../Company/JobPostingList";

import { Login } from "../Login/Login";
import SignUpMember from "../SignUp/SignUpMember";
import SignUpCompany from "../SignUp/SignUpCompany";

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

      // API servisin navigation parametresine ihtiyaç duyduğunda dummy obje gönderiyoruz.
      const dummyNavigation = { dispatch: () => {} };
      const userData = await GetRealApi("GetMyUserData", dummyNavigation);

      if (userData && userData.roles && userData.roles.length > 0) {
        // Tüm rolleri normalize ediyoruz: küçük harfe çevirip boşlukları temizliyoruz
        const roles = userData.roles.map(r => r.toLowerCase().trim());
        // Eğer "admin" rolü varsa onu kullan, yoksa "member" kontrolü
        if (roles.includes("admin")) {
          setRole("admin");
        } else if (roles.includes("member")) {
          setRole("member");
        } else {
          // Farklı bir rol varsa, örneğin ilkini kullanabilirsiniz
          setRole(roles[0]);
        }
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

  // Role bilgisine göre başlangıç ekranı belirle
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
      {/* Admin rolüne sahip kullanıcılar için ekranlar */}
      {role === "admin" && (
        <>
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="UsersScreen" component={UsersScreen} />
          <Drawer.Screen name="ResumesScreen" component={ResumesScreen} />
        </>
      )}

      {/* Sadece member rolüne sahip kullanıcılar için ekran */}
      {role === "member" && (
        <Drawer.Screen name="MemberScreen" component={MemberScreen} />
      )}

    {/* Sadece company rolüne sahip kullanıcılar için ekran */}
      {role === "company" && (
        <>
        <Drawer.Screen name="CompanyScreen" component={CompanyScreen} />
        <Drawer.Screen name="JobPostingList" component={JobPostingList} />
        </>

      )}

      {/* Giriş ve Kayıt ekranları (menüde görünmesin diye) */}
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="SignUpMember"
        component={SignUpMember}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="SignUpCompany"
        component={SignUpCompany}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      {/* Diğer gizli ekranlar */}
      <Drawer.Screen
        name="ProfileDetail"
        component={ProfileDetail}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AddProfile"
        component={AddProfile}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AddResume"
        component={AddResume}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="EditResume"
        component={EditResumeTabs}
        options={{
          drawerItemStyle: { display: "none" },
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="ResumeDetail"
        component={ResumeDetail}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="AddUser"
        component={AddUser}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="EditUser"
        component={EditUserTabs}
        options={{
          drawerItemStyle: { display: "none" },
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="MemberDetail"
        component={MemberDetail}
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="EditMember"
        component={EditMemberTabs}
        options={{
          drawerItemStyle: { display: "none" },
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="AddMember"
        component={AddMember}
        options={{
          drawerItemStyle: { display: "none" },
          unmountOnBlur: true,
        }}
      />
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
  exitButton: {
    marginRight: 15,
    padding: 8,
    backgroundColor: "black",
    borderRadius: 5,
  },
  exitText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyDrawer;
