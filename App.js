// App.js
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import { MyDrawer } from "./Screens/Navigator/Navigator";
import { Login } from "./Screens/Login/Login";
import SignUpMember from "./Screens/SignUp/SignUpMember";
import SignUpCompany from "./Screens/SignUp/SignUpCompany";

const Stack = createStackNavigator();

function AuthNavigator({ setIsLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="SignUpMember" component={SignUpMember} />
      <Stack.Screen name="SignUpCompany" component={SignUpCompany} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    setIsLoggedIn(!!userToken);
    setCheckingToken(false);
  };

  if (checkingToken) {
    return null; // Kontrol bitene kadar boş ekran
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MyDrawer setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <AuthNavigator setIsLoggedIn={setIsLoggedIn} />
      )}
    </NavigationContainer>
  );
}
