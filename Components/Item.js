import { View, Text } from "react-native";

export const Item = ({ label, text }) => {
  return (
    <View className="flex-row justify-between m-2 border-2 p-2">
      <Text className="font-bold">{label}</Text>
      <View className="flex-1 items-end">
        <Text>{text}</Text>
      </View>
    </View>
  );
};
