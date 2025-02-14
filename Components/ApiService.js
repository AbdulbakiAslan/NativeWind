import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { Login } from "../Screens/Login/Login";

const baseUrl = "http://10.0.2.2:5237/api/"; // Gerçek API

// Token'ı alacak fonksiyon
const getToken = async () => {
  return await AsyncStorage.getItem("userToken");
};

// Kullanıcıyı otomatik olarak çıkışa yönlendiren fonksiyon
const logout = async (navigation) => {
  await AsyncStorage.removeItem("userToken");
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  );
};

// API GET Fonksiyonu (401 Kontrolü ile)
export async function GetRealApi(url, navigation) {
  try {
    const apiUrl = baseUrl + url;
    const token = await getToken();

    const headers = token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };

    console.log("📡 Gerçek API GET İsteği:", apiUrl);
    console.log("🛠 Authorization Header:", headers);

    const response = await fetch(apiUrl, { headers });

    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    if (!response.ok) {
      console.error(`❌ API GET Hatası: HTTP ${response.status}`);
      return null;
    }

    const jsonResponse = await response.text();
    if (!jsonResponse) {
      console.warn("⚠️ API boş yanıt döndürdü!");
      return null;
    }

    return JSON.parse(jsonResponse);
  } catch (error) {
    console.log("❌ Gerçek API GET Hatası:", error);
    return null;
  }
}

// API POST Fonksiyonu (401 Kontrolü ile)
export async function PostRealApi(url, data, navigation) {
  try {
    const apiUrl = baseUrl + url;
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    console.log("📡 Gerçek API POST İsteği:", apiUrl);
    console.log("📦 Gönderilen Veri:", JSON.stringify(data));
    console.log("🛠 Authorization Header:", headers);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    const jsonResponse = await response.text();
    if (!jsonResponse) {
      console.warn("⚠️ API boş yanıt döndürdü!");
      return null;
    }

    return JSON.parse(jsonResponse);
  } catch (error) {
    console.log("❌ Gerçek API POST Hatası:", error);
    return null;
  }
}

// API PUT Fonksiyonu (401 Kontrolü ile)
export async function PutRealApi(url, data, navigation) {
  try {
    const apiUrl = baseUrl + url;
    const token = await getToken();
    const headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    console.log("📡 Gerçek API PUT İsteği:", apiUrl);
    console.log("📦 Gönderilen Veri:", JSON.stringify(data));

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    // Eğer API 204 (No Content) döndürüyorsa, güncelleme başarılı kabul edilir.
    if (response.status === 204) {
      console.log("📡 API başarıyla güncellendi (204), içerik boş.");
      return {};
    }

    // Eğer durum 200 ise ve içerik boşsa da, başarı olarak kabul edelim.
    const text = await response.text();
    if (!text) {
      console.log("📡 API başarıyla güncellendi, ancak içerik boş.");
      return {};
    }

    return JSON.parse(text);
  } catch (error) {
    console.log("❌ Gerçek API PUT Hatası:", error);
    return null;
  }
}
