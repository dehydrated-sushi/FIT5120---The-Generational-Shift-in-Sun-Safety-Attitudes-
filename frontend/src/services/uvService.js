import api from "./api";

export const getUVForecast = async () => {
  const response = await api.get("/uv/");
  return response.data;
};