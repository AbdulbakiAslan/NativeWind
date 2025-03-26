// utils.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { refreshToken } from "../Components/ApiService"; // Refresh fonksiyonunu içe aktarıyoruz

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

// Token kontrol fonksiyonu (token süresi dolduysa refresh token ile yenilemeyi dener)
export const checkToken = async (navigation) => {
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
    console.warn("⏳ Token süresi dolmuş! Refresh token ile yenileme deneniyor...");
    const refreshed = await refreshToken(navigation);
    if (!refreshed) {
      console.warn("⏳ Refresh token yenileme başarısız!");
      await AsyncStorage.removeItem("userToken");
      return false;
    }
    // Token başarıyla yenilendiyse, artık geçerli
    return true;
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

// Her sayfada token kontrolü yapan fonksiyon; token geçerli değilse (yenileme başarısızsa) kullanıcıyı giriş ekranına yönlendirir.
export const checkTokenAndRedirect = async (navigation) => {
  const isValid = await checkToken(navigation);
  if (!isValid) {
    console.warn("🚨 Token yenileme başarısız, giriş ekranına yönlendiriliyor...");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  }
};
