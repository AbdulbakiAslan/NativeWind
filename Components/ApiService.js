import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
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

// API DELETE Fonksiyonu (401 Kontrolü ile)

export async function DeleteRealApi(url, navigation) {
  try {
    const apiUrl = baseUrl + url;
    const token = await getToken();
    const headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    console.log("📡 Gerçek API DELETE İsteği:", apiUrl);
    console.log("🛠 Authorization Header:", headers);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers,
    });

    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    // Başarılı ise, genelde 200 veya 204 gibi bir yanıt dönebilir.
    console.log("✅ Silme işlemi başarılı:", await response.text());
    return true;
  } catch (error) {
    console.log("❌ Gerçek API DELETE Hatası:", error);
    return null;
  }
}

// API PATCH Fonksiyonu (401 Kontrolü ile)
export async function PatchRealApi(url, data, navigation) {
  try {
    const apiUrl = baseUrl + url;
    const token = await getToken();
    const headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    console.log("📡 Gerçek API PATCH İsteği:", apiUrl);
    console.log("📦 Gönderilen Veri:", JSON.stringify(data));

    const response = await fetch(apiUrl, {
      method: "PATCH",
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

    const textData = await response.text();
    if (!textData) {
      console.log("📡 API başarıyla güncellendi, ancak içerik boş.");
      return {};
    }

    return JSON.parse(textData);
  } catch (error) {
    console.log("❌ Gerçek API PATCH Hatası:", error);
    return null;
  }
}



/**
 * 1) Eğitim Listesini Getir
 * GET /api/Education
 */
export async function getEducationList(navigation) {
  try {
    const token = await getToken();
    const apiUrl = `${baseUrl}Education`; // => /api/Education

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("📡 GET =>", apiUrl);

    const response = await fetch(apiUrl, { headers });

    // 401 ise kullanıcıyı çıkışa yönlendir
    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    // Başarısız yanıt
    if (!response.ok) {
      console.error(`❌ GET Hatası: HTTP ${response.status}`);
      return null;
    }

    const textData = await response.text();
    if (!textData) {
      console.warn("⚠️ API boş yanıt döndürdü!");
      return null;
    }

    // JSON parse et ve döndür
    return JSON.parse(textData);
  } catch (error) {
    console.error("❌ GET EducationList Hatası:", error);
    return null;
  }
}

/**
 * 2) Yeni Eğitim Bilgisi Ekle
 * POST /api/Education
 */
export async function addEducation(navigation, educationData) {
  try {
    const token = await getToken();
    const apiUrl = `${baseUrl}Education`; // => /api/Education

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("📡 POST =>", apiUrl);
    console.log("📦 Gönderilen Veri:", educationData);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(educationData),
    });

    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    const textData = await response.text();
    if (!textData) {
      console.warn("⚠️ API boş yanıt döndürdü!");
      return null;
    }

    return JSON.parse(textData);
  } catch (error) {
    console.error("❌ POST Education Hatası:", error);
    return null;
  }
}

/**
 * 3) Mevcut Eğitim Bilgisini Güncelle
 * PUT /api/Education
 */
export async function updateEducation(navigation, educationData) {
  try {
    const token = await getToken();
    const apiUrl = `${baseUrl}Education`; // => /api/Education

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("📡 PUT =>", apiUrl);
    console.log("📦 Gönderilen Veri:", educationData);

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(educationData),
    });

    if (response.status === 401) {
      console.warn("🚨 Yetkisiz erişim! Kullanıcı çıkış yapıyor...");
      await logout(navigation);
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    // Bazı API'ler 204 (No Content) döndürebilir
    if (response.status === 204) {
      console.log("📡 API başarıyla güncellendi (204). İçerik yok.");
      return {};
    }

    const textData = await response.text();
    if (!textData) {
      console.log("📡 API başarıyla güncellendi, ancak içerik boş.");
      return {};
    }

    return JSON.parse(textData);
  } catch (error) {
    console.error("❌ PUT Education Hatası:", error);
    return null;
  }
}
