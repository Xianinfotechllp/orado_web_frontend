import axios from "axios";

const API_URL = "http://localhost:5000";

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`http://localhost:5000/user/login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};
