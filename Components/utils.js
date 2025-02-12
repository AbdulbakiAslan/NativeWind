import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

// JWT içindeki bilgileri çözümleme fonksiyonu
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("Token çözümleme hatası:", error);
    return null;
  }
};

// Token kontrol fonksiyonu (Süresi dolmuşsa false döndürür)
export const checkToken = async () => {
  const token = await AsyncStorage.getItem("userToken");

  if (!token) {
    console.warn("⚠ Token bulunamadı!");
    return false;
  }

  // Token içindeki bilgileri çöz
  const tokenPayload = parseJwt(token);

  if (!tokenPayload || !tokenPayload.exp) {
    console.error("❌ Geçersiz token formatı!");
    return false;
  }

  // Token süresi dolmuş mu?
  const expirationTime = tokenPayload.exp * 1000;
  if (Date.now() >= expirationTime) {
    console.warn("⏳ Token süresi dolmuş!");
    await AsyncStorage.removeItem("userToken"); // Token'ı sil
    return false;
  }

  return true;
};

// Kullanıcıyı çıkış yaptırma fonksiyonu
export const logout = async (navigation) => {
  await AsyncStorage.removeItem("userToken");
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};

// 📌 **Her sayfada token kontrolü yapan fonksiyon**
export const checkTokenAndRedirect = async (navigation) => {
  const isValid = await checkToken();
  if (!isValid) {
    console.warn("🚨 Token süresi dolmuş, giriş ekranına yönlendiriliyor...");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  }
};
