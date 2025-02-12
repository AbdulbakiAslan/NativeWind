import * as React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import { checkTokenAndRedirect } from "../../Components/utils"; // 📌 Token kontrolünü ekledik

export function HomeScreen() {
  const navigation = useNavigation();

  // 📌 **Sayfa açıldığında token kontrolü yap**
  React.useEffect(() => {
    checkTokenAndRedirect(navigation);
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate("Profile")}>
        Go to Profile
      </Button>
    </View>
  );
}
