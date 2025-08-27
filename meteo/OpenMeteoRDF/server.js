// server_hourly.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.get('/openmeteo/forecast', async (req, res) => {
  const { lat, lon, days } = req.query;
  console.log(`Request received: lat=${lat}, lon=${lon}, days=${days}`);

  if (!lat || !lon || !days) {
    return res.status(400).json({ error: "Missing parameters: lat, lon, days required" });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=${days}`;
    const response = await fetch(url);
    const data = await response.json();

    const hourly = data.hourly;
    const daily = data.daily;

    const hourlyData = hourly.time.map((timeStr, idx) => {
      const date = timeStr.split('T')[0];
      const dailyIdx = daily.time.indexOf(date);

      return {
        date: date,
        datetime: timeStr,
        latitude: data.latitude,
        longitude: data.longitude,
        temperature_2m: hourly.temperature_2m[idx],
        relative_humidity_2m: hourly.relative_humidity_2m[idx],
        precipitation_probability: hourly.precipitation_probability[idx],
        precipitation: hourly.precipitation[idx],
        visibility: hourly.visibility[idx],
        wind_speed_10m: hourly.wind_speed_10m[idx],
        wind_direction_10m: hourly.wind_direction_10m[idx],
        uv_index_max: daily.uv_index_max[dailyIdx]
      };
    });

    res.json({ data: hourlyData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch or process Open-Meteo data" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on 0.0.0.0:${PORT}`);
});
