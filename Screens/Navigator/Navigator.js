// MyDrawer.js
import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

// Ekranlar
import { HomeScreen } from "../Home/HomeScreen";
import { ProfileScreen } from "../Profiles/ProfileScreen";
import { ProfileDetail } from "../Profiles/ProfileDetail";
import { AddProfile } from "../Profiles/AddProfile";
import { ResumesScreen } from "../Resumes/ResumesScreen";
import { AddResume } from "../Resumes/AddResume";
import { ResumeDetail } from "../Resumes/ResumeDetail";
import EditResumeTabs from "../Resumes/Tabs/EditResumeTabs";

import { checkToken } from "../../Components/utils";

const Drawer = createDrawerNavigator();

export function MyDrawer({ setIsLoggedIn }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const tokenValid = await checkToken();
      if (!tokenValid) {
        console.warn("Token süresi dolmuş, kullanıcı çıkış yapıyor...");
        await AsyncStorage.removeItem("userToken");
        setIsLoggedIn(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#ff0000" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => <ExitButton setIsLoggedIn={setIsLoggedIn} />,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Resumes" component={ResumesScreen} />

      {/* Menüde görünmesini istemediğiniz ekranlar */}
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
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <Drawer.Screen
        name="ResumeDetail"
        component={ResumeDetail}
        options={{ drawerItemStyle: { display: "none" } }}
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
