import axios from 'axios';

const API_BASE_URL = 'https://reqres.in/api';
const API_KEY = 'reqres-free-v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

export const fetchUsers = async (page = 1) => {
  try {
    const response = await apiClient.get(`/users?page=${page}`);
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.error("Invalid user response structure:", response.data);
    throw new Error('Invalid user response structure from server.');
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch users.');
  }
};

export const deleteUser = async (userId) => {
  try {
    await apiClient.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || `Failed to delete user ${userId}.`);
  }
};