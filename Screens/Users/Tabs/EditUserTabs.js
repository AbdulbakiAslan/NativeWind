// Users/Tabs/EditUserTabs.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AdminAccounts from "./AdminAccounts";
import MemberAccounts from "./MemberAccounts";
import CompanyAccounts from "./CompanyAccounts";

const Tab = createMaterialTopTabNavigator();

const EditUserTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "#ff0000" },
        tabBarScrollEnabled: true,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="AdminAccounts"
        component={AdminAccounts}
        options={{ tabBarLabel: "YÖNETİCİ HESAPLARI" }}
      />
      <Tab.Screen
        name="MemberAccounts"
        component={MemberAccounts}
        options={{ tabBarLabel: "ÜYE HESAPLARI" }}
      />
      <Tab.Screen
        name="CompanyAccounts"
        component={CompanyAccounts}
        options={{ tabBarLabel: "ŞİRKET HESAPLARI" }}
      />
    </Tab.Navigator>
  );
};

export default EditUserTabs;
