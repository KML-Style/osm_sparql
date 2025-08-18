export async function getMeteoForecast(lat, lon, days){
    const url = `
    https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=${days}
    `
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error : cannot fetch meteo data.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error :", error);
    return null;
  }
}

export function extractTemperature(json, hourIndex) {
    if (!json || !json.hourly?.temperature_2m) return null;
    return json.hourly.temperature_2m[hourIndex];
}

export function extractHumidity(json, hourIndex) {
    if (!json || !json.hourly?.relative_humidity_2m) return null;
    return json.hourly.relative_humidity_2m[hourIndex];
}

export function extractPrecipitationProbability(json, hourIndex) {
    if (!json || !json.hourly?.precipitation_probability) return null;
    return json.hourly.precipitation_probability[hourIndex];
}

export function extractPrecipitation(json, hourIndex) {
    if (!json || !json.hourly?.precipitation) return null;
    return json.hourly.precipitation[hourIndex];
}

export function extractVisibility(json, hourIndex) {
    if (!json || !json.hourly?.visibility) return null;
    return json.hourly.visibility[hourIndex];
}

export function extractWindSpeed(json, hourIndex) {
    if (!json || !json.hourly?.wind_speed_10m) return null;
    return json.hourly.wind_speed_10m[hourIndex];
}

export function extractWindDirection(json, hourIndex) {
    if (!json || !json.hourly?.wind_direction_10m) return null;
    return json.hourly.wind_direction_10m[hourIndex];
}

export function extractUVIndexMax(json, dayIndex = 0) {
    if (!json || !json.daily?.uv_index_max) return null;
    return json.daily.uv_index_max[dayIndex];
}
