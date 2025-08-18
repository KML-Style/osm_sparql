export async function getMeteoHistorical(lat, lon, start_date, end_date) {
    // Date format : YYYY-MM-DD
    const url = `
    https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start_date}&end_date=${end_date}&daily=sunrise,sunset,wind_speed_10m_max,precipitation_sum,temperature_2m_mean,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto
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
