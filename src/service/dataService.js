import axios from '../../node_modules/axios';

const appid = 'a9f3c383370fb37fb41f4dae29e5d027';
let serviceUrl = "https://api.openweathermap.org/data/2.5/weather";
let forecastAPI = "https://api.openweathermap.org/data/2.5/forecast"

export async function getCurrentReport(lat,lon) {
    const response = await axios.get(serviceUrl,{
        params: {
            lat:lat,
            lon:lon,
            units:'metric',
            appid:appid
        }
    })
    return response.data;
}

export async function getCurrentReportByCityName(cityName) {
    const response = await axios.get(serviceUrl,{
        params: {
            q:cityName,
            units:'metric',
            appid:appid
        }
    })
    return response.data;
}

export async function getWeatherForecastByCityName(cityName) {
    const response = await axios.get(forecastAPI,{
        params: {
            q:cityName,
            units:'metric',
            appid:appid
        }
    })
    return response.data;
}
