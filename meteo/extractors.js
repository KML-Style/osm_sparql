export function extractTemperature(json, hourIndex = 0) {
    if (!json || !json.hourly?.temperature_2m) return null;
    return json.hourly.temperature_2m[hourIndex];
}

export function extractHumidity(json, hourIndex = 0) {
    if (!json || !json.hourly?.relative_humidity_2m) return null;
    return json.hourly.relative_humidity_2m[hourIndex];
}

export function extractPrecipitationProbability(json, hourIndex = 0) {
    // for forecat only
    if (!json || !json.hourly?.precipitation_probability) return null;
    return json.hourly.precipitation_probability[hourIndex];
}

export function extractPrecipitation(json, hourIndex = 0) {
    if (!json || !json.hourly?.precipitation) return null;
    return json.hourly.precipitation[hourIndex];
}

export function extractVisibility(json, hourIndex = 0) {
    // for forecast only
    if (!json || !json.hourly?.visibility) return null;
    return json.hourly.visibility[hourIndex];
}

export function extractWindSpeed(json, hourIndex = 0) {
    if (!json || !json.hourly?.wind_speed_10m) return null;
    return json.hourly.wind_speed_10m[hourIndex];
}

export function extractWindDirection(json, hourIndex = 0) {
    // for forecast only
    if (!json || !json.hourly?.wind_direction_10m) return null;
    return json.hourly.wind_direction_10m[hourIndex];
}

export function extractUVIndexMax(json, dayIndex = 0) {
    // for forecast only
    if (!json || !json.daily?.uv_index_max) return null;
    return json.daily.uv_index_max[dayIndex];
}

export function extractWindSpeedMax(json, dayIndex = 0) {
    // for historical only
    if (!json || !json.daily?.wind_speed_10m_max) return null;
    return json.daily.wind_speed_10m_max[dayIndex];
}

export function extractTemperatureMax(json, dayIndex = 0) {
    // for historical only
    if (!json || !json.daily?.temperature_2m_max) return null;
    return json.daily.temperature_2m_max[dayIndex];
}

export function extractTemperatureMin(json, dayIndex = 0) {
    // for historical only
    if (!json || !json.daily?.temperature_2m_min) return null;
    return json.daily.temperature_2m_min[dayIndex];
}

export function extractTemperatureMean(json, dayIndex = 0) {
    // for historical only
    if (!json || !json.daily?.temperature_2m_mean) return null;
    return json.daily.temperature_2m_mean[dayIndex];
}

export function extractPrecipitationSum(json, dayIndex = 0) {
    // for historical only
    if (!json || !json.daily?.precipitation_sum) return null;
    return json.daily.precipitation_sum[dayIndex];
}
