import axios from 'axios';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const fetchLocationSuggestions = async (query: string, userCoords?: [number, number]) => {
  if (!MAPBOX_TOKEN) throw new Error('Missing Mapbox token');

  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json`;

  const params: Record<string, any> = {
    access_token: MAPBOX_TOKEN,
    autocomplete: true,
    limit: 5,
    country: 'KE', // 🇰🇪 restrict to Kenya if that's your use case
  };

  if (userCoords) {
    params.proximity = userCoords.join(',');
  }

  const response = await axios.get(endpoint, { params });
  return response.data.features;
};
