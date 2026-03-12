import { useEffect, useState } from "react";
import { getUVForecast } from "../services/uvService";

const useUVData = () => {
  const [uvData, setUvData] = useState([]);
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUVData = async () => {
      try {
        setLoading(true);
        const data = await getUVForecast();
        setUvData(data.uv_forecast || []);
        setCity(data.city || "");
        setTimezone(data.timezone || "");
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch UV data");
      } finally {
        setLoading(false);
      }
    };

    fetchUVData();
  }, []);

  return { uvData, city, timezone, loading, error };
};

export default useUVData;