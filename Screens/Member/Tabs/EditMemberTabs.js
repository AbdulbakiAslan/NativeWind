import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";

// "My" sayfalarını içe aktarıyoruz.
import MyGeneralInfo from "./MyGeneralInfo";
import MyEducation from "./MyEducation";
import MyLanguage from "./MyLanguage";
import MyWorkExperience from "./MyWorkExperience";
import MyComputerSkills from "./MyComputerSkills";
import MyReferences from "./MyReferences";
import MyCourses from "./MyCourses";
import MyCertificates from "./MyCertificates";

const Tab = createMaterialTopTabNavigator();

const EditMemberTabs = () => {
  const route = useRoute();
  const member = route.params?.member;
  
  // Navigator'ın yeniden mount edilmesi için key oluşturuyoruz.
  const key = `EditMemberTabs-${member ? member.id : "default"}`;

  return (
    <Tab.Navigator
      key={key}
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "#ff0000" },
        tabBarScrollEnabled: true,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="MyGeneralInfo"
        options={{ tabBarLabel: "Genel Bilgiler" }}
        component={MyGeneralInfo}
      />
      <Tab.Screen
        name="MyEducation"
        options={{ tabBarLabel: "Eğitim Bilgileri" }}
        component={MyEducation}
      />
      <Tab.Screen
        name="MyLanguage"
        options={{ tabBarLabel: "Dil Bilgileri" }}
        component={MyLanguage}
      />
      <Tab.Screen
        name="MyWorkExperience"
        options={{ tabBarLabel: "İş Deneyimleri" }}
        component={MyWorkExperience}
      />
      <Tab.Screen
        name="MyComputerSkills"
        options={{ tabBarLabel: "Bilgisayar Becerileri" }}
        component={MyComputerSkills}
      />
      <Tab.Screen
        name="MyReferences"
        options={{ tabBarLabel: "Referanslar" }}
        component={MyReferences}
      />
      <Tab.Screen
        name="MyCourses"
        options={{ tabBarLabel: "Kurslar" }}
        component={MyCourses}
      />
      <Tab.Screen
        name="MyCertificates"
        options={{ tabBarLabel: "Sertifikalar" }}
        component={MyCertificates}
      />
    </Tab.Navigator>
  );
};

export default EditMemberTabs;
