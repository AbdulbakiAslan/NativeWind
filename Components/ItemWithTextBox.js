import { View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export const ItemWithTextBox = ({ label, text, setText }) => {
  return (
    <View className="flex-row m-2 border-2 p-2 items-center justify-center">
      <Text className="font-bold ">{label}</Text>
      <View className="flex-1 place-stretch">
        <TextInput placeholder={label} value={text} onChange={setText} />
      </View>
    </View>
  );
};
