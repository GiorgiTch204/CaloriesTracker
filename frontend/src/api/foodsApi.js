import axios from "axios";

const API_URL = "http://localhost:5000/api";

export async function getCategories() {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
}

export async function getFoods(page = 1, limit = 50, category = "") {
  const response = await axios.get(`${API_URL}/foods`, {
    params: {
      page,
      limit,
      category
    }
  });

  return response.data;
}

export async function searchFoods(query, category = "") {
  const response = await axios.get(`${API_URL}/foods/search`, {
    params: {
      q: query,
      category
    }
  });

  return response.data;
}

export async function calculateCalories(foodId, grams) {
  const response = await axios.post(`${API_URL}/calculate`, {
    foodId,
    grams
  });

  return response.data;
}