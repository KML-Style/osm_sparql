# Meteo API

The aim of the project is to get meteo forecats and historicals for a point, provided by OpenMeteo API.

## Files

### `meteoApi.js`
Contains functions to fetch meteo data:
- `getMeteoForecast(lat, lon, days)` → returns forecast JSON (with hourly temperature, humidity, precipitation and its probability, visibility, wind speed and direction and daily UV index max) for the next days corresponding to the given coordinates.  
- `getMeteoHistorical(lat, lon, startDate, endDate)` → returns historical JSON (with hourly temperature, humidity, precipitation, wind speed & daily temperautre min/max/mean, precipitation sum and wind max speed) for the given coordinates and date range.  

Both functions return a JSON object that follows the **Open-Meteo** structure.

### `extractors.js`
Contains functions to extract values from the obtained JSON object.

*Note : Valid date format is **YYYY-MM-DD***

Each function returns `null` if the value is not available.

---

#### Hourly Extractors

##### `extractTemperature(json, hourIndex = 0)`
> Returns the temperature (`temperature_2m`) for the given hour.

---

##### `extractHumidity(json, hourIndex = 0)`
> Returns the relative humidity (`relative_humidity_2m`) for the given hour.

---

##### `extractPrecipitationProbability(json, hourIndex = 0)`
> **Forecast only**  
Returns the precipitation probability (`precipitation_probability`) for the given hour.

---

##### `extractPrecipitation(json, hourIndex = 0)`
> Returns the precipitation (`precipitation`) for the given hour.

---

##### `extractVisibility(json, hourIndex = 0)`
> **Forecast only**  
Returns the visibility (`visibility`) for the given hour.

---

##### `extractWindSpeed(json, hourIndex = 0)`
> Returns the wind speed (`wind_speed_10m`) for the given hour.

---

##### `extractWindDirection(json, hourIndex = 0)`
> **Forecast only**  
Returns the wind direction (`wind_direction_10m`) for the given hour.

---

#### Daily Extractors

##### `extractUVIndexMax(json, dayIndex = 0)`
> **Forecast only**  
Returns the maximum UV index (`uv_index_max`) for the given day.

---

##### `extractWindSpeedMax(json, dayIndex = 0)`
> **Historical only**  
Returns the maximum wind speed (`wind_speed_10m_max`) for the given day.

---

##### `extractTemperatureMax(json, dayIndex = 0)`
> **Historical only**  
Returns the maximum temperature (`temperature_2m_max`) for the given day.

---

##### `extractTemperatureMin(json, dayIndex = 0)`
> **Historical only**  
Returns the minimum temperature (`temperature_2m_min`) for the given day.

---

##### `extractTemperatureMean(json, dayIndex = 0)`
> **Historical only**  
Returns the mean temperature (`temperature_2m_mean`) for the given day.

---

##### `extractPrecipitationSum(json, dayIndex = 0)`
> **Historical only**  
Returns the total precipitation (`precipitation_sum`) for the given day.

## Usage Example

```javascript
import { getMeteoForecast, getMeteoHistorical } from "./meteoApi.js";
import { 
  extractPrecipitation, extractTemperatureMax
} from "./extractors.js";

async function runExample() {
  const forecastJson = await getMeteoForecast(45.782344, 4.866044, 1); 
  console.log(forecastJson); // raw JSON

  const hourIndex = 1; //data in one hour
  const precipitation = extractPrecipitation(forecastJson, hourIndex);
  console.log(`${precipitation} mm precipitation in the next hour`);
}

async function runExample2() {
  const historicalJson = await getMeteoHistorical(45.782344, 4.866044, "2025-08-16","2025-08-24"); 
  console.log(historicalJson);

  const dayIndex = 3; 
  const tempMax = extractTemperatureMax(historicalJson, dayIndex);
  console.log(`${tempMax} ° max`);
}
runExample();
runExample2();
```
