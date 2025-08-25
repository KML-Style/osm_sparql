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
