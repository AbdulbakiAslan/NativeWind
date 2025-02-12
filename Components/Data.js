export const baseUrl = "https://dummyjson.com/";

export async function GetApi(url) {
  try {
    const apiUrl = baseUrl + url;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("API GET Hatası:", error);
  }
}

export async function PostApi(url, data) {
  try {
    const apiUrl = baseUrl + url;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON formatını belirtmek için ekledik
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.log("API POST Hatası:", error);
  }
}
