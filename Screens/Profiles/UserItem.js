import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity } from "react-native";

export const UserItem = ({ user }) => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => nav.navigate("ProfileDetail", { profileId: user.id })}
      className="m-2 flex-row border-2 items-center"
    >
      <Image
        style={{ width: 100, height: 100 }}
        source={{ uri: user?.image }}
      />
      <View>
        <View className="flex-row space-x-2 ">
          <Text className="font-bold">{user.firstName}</Text>
          <Text className="font-bold">{user.lastName}</Text>
        </View>
        <Text>{user.email}</Text>
        <Text>{user.phone}</Text>
        <Text>{user.role}</Text>
      </View>
    </TouchableOpacity>
  );
};
