import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const ResumeItem = ({ resume }) => {
  const nav = useNavigation();

  return (
    <TouchableOpacity
      className="border p-3 m-2 rounded-lg bg-white shadow-md"
      onPress={() => nav.navigate("ResumeDetail", { resumeId: resume.id })}
    >
      <Text className="text-lg font-bold">
        {resume.name} {resume.lastName}
      </Text>
      <Text className="text-gray-500">{resume.email}</Text>
    </TouchableOpacity>
  );
};
