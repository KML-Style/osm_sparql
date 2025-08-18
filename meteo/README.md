# Meteo API

The aim of the project is to get meteo forecats and historicals for a point, provided by OpenMeteo API.

## Files

### `meteoApi.js`
Contains functions to fetch meteo data:
- `getForecast(lat, lon)` → returns forecast JSON (with hourly temperature, humidity, precipitation and its probability, visibility, wind speed and direction and daily UV index max) for the given coordinates.  
- `getHistory(lat, lon, startDate, endDate)` → returns historical JSON (with hourly temperature, humidity, precipitation, wind speed & daily temperautre min/max/mean, precipitation sum and wind max speed) for the given coordinates and date range.  

Both functions return a JSON object that follows the **Open-Meteo** structure.

### `extractors.js`
Contains functions to extract values from the obtained JSON object.

*Note : Valid date format is **YYYY-MM-DD***

Each function returns `null` if the value is not available.

## Usage Example

```javascript
import { getForecast } from "./meteoApi.js";
import { 
  extractPrecipitation
} from "./extractors.js";

async function runExample() {
  const forecastJson = await getForecast(45.782344, 4.866044); 

  const hourIndex = 1; //data in one hour
  const precipitation = extractPrecipitation(forecastJson, hourIndex);

  console.log(`${precipitation} mm precipitation`);
}

runExample();
```
