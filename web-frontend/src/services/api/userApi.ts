import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/identity/api/v1/users`;

// Function to get the current user's profile
export const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // The actual data is nested in response.data.data
    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};
