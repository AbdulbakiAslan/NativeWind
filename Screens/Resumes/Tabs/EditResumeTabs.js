// Resumes/Tabs/EditResumeTabs.js

import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";

// Sekme bileşenlerini import edin
import GeneralInformation from "./GeneralInformation";
import EducationInfo from "./EducationInfo";
import LanguageInfo from "./LanguageInfo";
import WorkExperience from "./WorkExperience";
import ComputerSkills from "./ComputerSkills";
import References from "./References";
import Courses from "./Courses";
import Certificates from "./Certificates";

const Tab = createMaterialTopTabNavigator();

const EditResumeTabs = () => {
  // Navigator.js'den gelen "resume" parametresini alıyoruz
  const route = useRoute();
  const { resume } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        // Tab başlıklarının style ayarları
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarIndicatorStyle: { backgroundColor: "#ff0000" },
        tabBarScrollEnabled: true,
      }}
    >
      {/* Her sekme için bir Screen tanımlıyoruz */}
      <Tab.Screen
        name="GenelBilgiler"
        component={GeneralInformation}
        options={{ tabBarLabel: "Genel Bilgiler" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="Education"
        component={EducationInfo}
        options={{ tabBarLabel: "Eğitim Bilgileri" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="Language"
        component={LanguageInfo}
        options={{ tabBarLabel: "Dil Bilgileri" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="WorkExperience"
        component={WorkExperience}
        options={{ tabBarLabel: "İş Deneyimleri" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="ComputerSkills"
        component={ComputerSkills}
        options={{ tabBarLabel: "Bilgisayar Bilgisi" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="References"
        component={References}
        options={{ tabBarLabel: "Referanslar" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="Courses"
        component={Courses}
        options={{ tabBarLabel: "Kurslar" }}
        initialParams={{ resume }}
      />
      <Tab.Screen
        name="Certificates"
        component={Certificates}
        options={{ tabBarLabel: "Sertifikalar" }}
        initialParams={{ resume }}
      />
    </Tab.Navigator>
  );
};

export default EditResumeTabs;
