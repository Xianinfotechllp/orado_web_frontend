import axios from 'axios';

export const createSurgeArea = async (surgeData) => {
  try {
    const response = await axios.post('http://localhost:5000/admin/surge/add', surgeData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;

  } catch (error) {
    console.error('Error in createSurgeArea API:', error);
    throw error;
  }
};
