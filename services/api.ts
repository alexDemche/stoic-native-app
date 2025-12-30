import axios from 'axios';

// Якщо тестуєш на реальному Android, використовуй IP свого компа замість localhost
const BASE_URL = 'http://192.168.1.XX:8000/api'; 

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getUserStats = async (userId: number) => {
  try {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};