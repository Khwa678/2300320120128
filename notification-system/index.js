const axios = require("axios");

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = "PASTE_THE_FULL_ACCESS_TOKEN_HERE";

async function getTopNotifications() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Message:", error.response?.data);
  }
}


getTopNotifications();