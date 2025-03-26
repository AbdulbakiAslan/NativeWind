// ApiService.js
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
  await AsyncStorage.removeItem("refreshToken");
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  );
};

// Refresh token işlemi: Backend'deki RefreshToken endpoint'ine istek yapar.
export async function refreshToken(navigation) {
  try {
    const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      console.warn("Refresh token bulunamadı!");
      return false;
    }
    const refreshUrl = baseUrl + "Authentication/RefreshToken";
    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.accessToken && data.refreshToken) {
        await AsyncStorage.setItem("userToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);
        console.log("Tokenlar yenilendi:", data.accessToken);
        return true;
      }
    }
    console.warn("Refresh token yenileme başarısız:", response.status);
    return false;
  } catch (error) {
    console.error("Refresh token hatası:", error);
    return false;
  }
}

// Helper: API çağrısını refresh token mantığı ile yapar.
async function fetchWithRefresh(apiUrl, options, navigation) {
  let response = await fetch(apiUrl, options);
  if (response.status === 401) {
    console.warn("🚨 Token süresi dolmuş, refresh token ile yenileniyor...");
    const refreshed = await refreshToken(navigation);
    if (refreshed) {
      const token = await getToken();
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      response = await fetch(apiUrl, options);
    } else {
      console.warn("🚨 Refresh token yenileme başarısız, çıkış yapılıyor.");
      await logout(navigation);
    }
  }
  return response;
}

// API GET Fonksiyonu (401 Kontrolü ile)
export async function GetRealApi(url, navigation) {
  try {
    const apiUrl = baseUrl + url;
    const token = await getToken();
    const headers = token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };

    const response = await fetchWithRefresh(apiUrl, { headers }, navigation);

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

    const response = await fetchWithRefresh(
      apiUrl,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      },
      navigation
    );

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

    const response = await fetchWithRefresh(
      apiUrl,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      },
      navigation
    );

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    if (response.status === 204) {
      console.log("📡 API başarıyla güncellendi (204), içerik boş.");
      return {};
    }

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

    const response = await fetchWithRefresh(
      apiUrl,
      {
        method: "DELETE",
        headers,
      },
      navigation
    );

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

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

    const response = await fetchWithRefresh(
      apiUrl,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      },
      navigation
    );

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

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
    const apiUrl = `${baseUrl}Education`;
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("📡 GET =>", apiUrl);

    const response = await fetchWithRefresh(apiUrl, { headers }, navigation);

    if (!response.ok) {
      console.error(`❌ GET Hatası: HTTP ${response.status}`);
      return null;
    }

    const textData = await response.text();
    if (!textData) {
      console.warn("⚠️ API boş yanıt döndürdü!");
      return null;
    }

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
    const apiUrl = `${baseUrl}Education`;
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("📡 POST =>", apiUrl);
    console.log("📦 Gönderilen Veri:", educationData);

    const response = await fetchWithRefresh(
      apiUrl,
      {
        method: "POST",
        headers,
        body: JSON.stringify(educationData),
      },
      navigation
    );

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
    const apiUrl = `${baseUrl}Education`;
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log("📡 PUT =>", apiUrl);
    console.log("📦 Gönderilen Veri:", educationData);

    const response = await fetchWithRefresh(
      apiUrl,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(educationData),
      },
      navigation
    );

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

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
