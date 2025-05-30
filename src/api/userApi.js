import axios from "axios";

const API_BASE_URL = 'https://reqres.in/api';

export const fetchUsers = async (page = 1) => {
    const response = await axios.get(`${API_BASE_URL}/users?page=${page}`);

    if (response.data && Array.isArray(response.data.data)){
        return response.data.data;
    }
    throw new Error ("Users lists not found");
}

export const deleteUser = async(userId) => {
    await axios.delete(`${API_BASE_URL}/users/${userId}`)
}