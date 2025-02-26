import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";

// Tüm sekme bileşenlerini içe aktarıyoruz
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
  const route = useRoute();
  const resume = route.params?.resume;

  // Resume değiştiğinde Navigator'a farklı key vererek yeniden mount edilmesini sağlıyoruz.
  const key = `EditResumeTabs-${resume ? resume.id : "default"}`;

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
        name="GenelBilgiler"
        options={{ tabBarLabel: "Genel Bilgiler" }}
      >
        {(props) => <GeneralInformation {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen
        name="Education"
        options={{ tabBarLabel: "Eğitim Bilgileri" }}
      >
        {(props) => <EducationInfo {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen name="Language" options={{ tabBarLabel: "Dil Bilgileri" }}>
        {(props) => <LanguageInfo {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen
        name="WorkExperience"
        options={{ tabBarLabel: "İş Deneyimleri" }}
      >
        {(props) => <WorkExperience {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen
        name="ComputerSkills"
        options={{ tabBarLabel: "Bilgisayar Becerileri" }}
      >
        {(props) => <ComputerSkills {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen name="References" options={{ tabBarLabel: "Referanslar" }}>
        {(props) => <References {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen name="Courses" options={{ tabBarLabel: "Kurslar" }}>
        {(props) => <Courses {...props} resume={resume} />}
      </Tab.Screen>
      <Tab.Screen name="Certificates" options={{ tabBarLabel: "Sertifikalar" }}>
        {(props) => <Certificates {...props} resume={resume} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default EditResumeTabs;
