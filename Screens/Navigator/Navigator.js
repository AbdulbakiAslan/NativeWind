// Screens/Navigator/Navigator.js
import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetRealApi } from "../../Components/ApiService";
import { checkToken } from "../../Components/utils";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen } from "../Home/HomeScreen";
import UsersScreen from "../Users/UsersScreen";
import CompaniesScreen from "../Companies/CompaniesScreen";
import JobPostingList from "../Companies/JobPostingList";
import JobPostingCreate from "../Companies/JobPostingCreate";
import MemberScreen from "../Member/MemberScreen";
import CompanyScreen from "../Company/CompanyScreen";
import MyJobPostings from "../Company/MyJobPostings";
import MyJobPostingCreate from "../Company/MyJobPostingCreate";
import { ResumesScreen } from "../Resumes/ResumesScreen";
import AddResume from "../Resumes/AddResume";
import ResumeDetail from "../Resumes/ResumeDetail";
import EditResumeTabs from "../Resumes/Tabs/EditResumeTabs";
import { ProfileDetail } from "../Profiles/ProfileDetail";
import { AddProfile } from "../Profiles/AddProfile";
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
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
        return;
      }
      const dummyNav = { dispatch: () => {} };
      const userData = await GetRealApi("GetMyUserData", dummyNav);
      const roles = userData?.roles?.map(r => r.toLowerCase().trim()) || [];
      if (roles.includes("admin")) setRole("admin");
      else if (roles.includes("member")) setRole("member");
      else if (roles.includes("company")) setRole("company");
      else setRole("admin");
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
    role === "admin"
      ? "Home"
      : role === "member"
      ? "MemberScreen"
      : "CompanyScreen";

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
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{ drawerLabel: "Panel" }}
          />
          <Drawer.Screen
            name="UsersScreen"
            component={UsersScreen}
            options={{ drawerLabel: "Kullanıcılar" }}
          />
          <Drawer.Screen
            name="ResumesScreen"
            component={ResumesScreen}
            options={{ drawerLabel: "Özgeçmişler" }}
          />
          <Drawer.Screen
            name="CompaniesScreen"
            component={CompaniesScreen}
            options={{ drawerLabel: "Şirketler" }}
          />
          <Drawer.Screen
            name="JobPostingList"
            component={JobPostingList}
            options={{ drawerLabel: "Tüm İlanlar", title: "İş İlanları" }}
          />
          <Drawer.Screen
            name="JobPostingCreate"
            component={JobPostingCreate}
            options={{
              drawerItemStyle: { display: "none" },
              title: "İlan Oluştur / Düzenle",
              headerLeft: ({ navigation }) => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 16 }}
                >
                  <Text style={{ color: "#fff" }}>Geri</Text>
                </TouchableOpacity>
              ),
            }}
          />
        </>
      )}

      {role === "member" && (
        <Drawer.Screen
          name="MemberScreen"
          component={MemberScreen}
          options={{ drawerLabel: "Özgeçmişim" }}
        />
      )}

      {role === "company" && (
        <>
          <Drawer.Screen
            name="CompanyScreen"
            component={CompanyScreen}
            options={{ drawerLabel: "Şirketim" }}
          />
          <Drawer.Screen
            name="MyJobPostings"
            component={MyJobPostings}
            options={{ drawerLabel: "İş İlanlarım", title: "İş İlanlarım" }}
          />
          <Drawer.Screen
            name="MyJobPostingCreate"
            component={MyJobPostingCreate}
            options={{
              drawerItemStyle: { display: "none" },
              title: "İlan Oluştur / Düzenle",
              headerLeft: ({ navigation }) => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginLeft: 16 }}
                >
                  <Text style={{ color: "#fff" }}>Geri</Text>
                </TouchableOpacity>
              ),
            }}
          />
        </>
      )}

      {/* gizli diğer sayfalar */}
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
        name="ResumeDetail"
        component={ResumeDetail}
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
        name="AddMember"
        component={AddMember}
        options={{
          drawerItemStyle: { display: "none" },
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name="EditMember"
        component={EditMemberTabs}
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
