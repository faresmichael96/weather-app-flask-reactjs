import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import GlobalState from "../contexts/GlobalState";
import { Link } from "react-router-dom";

export default function Dashboard() {

    const { authenticatedUser, setAuthenticatedUser } = useContext(GlobalState);
    const [weatherData, setWeatherData] = useState();
    const [loading, setLoading] = useState(false);

    const logout = () => {
        setAuthenticatedUser();
        localStorage.removeItem('auth_token');
    }

    useEffect(() => {
        setLoading(true);
        axios({
            url: '/get-weather',
            method: 'get',
        })
            .then(res => {
                console.log(res.data)
                setWeatherData(res.data)
                setLoading(false)
            })
            .catch(res => {
                setLoading(false)
                console.log(res.response)
            })
    }, []);

    return (
        <>
            {
                weatherData ?
                    <div className="page-wrapper dashboard">
                        <div className="top">
                            <h1>Dashboard, Welcome {authenticatedUser?.name}</h1>
                            <Link to="/login" className="logout" onClick={logout} >Logout</Link>
                        </div>

                        <div className="weather-data-wrapper">
                            {
                                weatherData?.yesterdayWeather ?
                                    <div className="weather">
                                        <img src={weatherData?.yesterdayWeather.forecast.forecastday[0].day.condition.icon} />
                                        <p>Temprature in Celsius: {weatherData?.yesterdayWeather.forecast.forecastday[0].day.avgtemp_c}</p>
                                        <p>Wind Speed: {weatherData?.yesterdayWeather.forecast.forecastday[0].day.maxwind_kph}</p>
                                        <p>Date: {weatherData?.yesterdayWeather.location.localtime}</p>

                                    </div>
                                    :
                                    null
                            }
                            {
                                weatherData?.todayWeather ?
                                    <div className="weather">
                                        <img src={weatherData?.todayWeather.current.condition.icon} />
                                        <p>Temprature in Celsius: {weatherData?.todayWeather.current.temp_c}</p>
                                        <p>Wind Speed: {weatherData?.todayWeather.current.wind_kph}</p>
                                        <p>Date: {weatherData?.todayWeather.location.localtime}</p>
                                    </div>
                                    :
                                    null
                            }
                            {
                                weatherData?.tomorrowWeather ?
                                    <div className="weather">
                                        <img src={weatherData?.tomorrowWeather.forecast.forecastday[0].day.condition.icon} />
                                        <p>Temprature in Celsius: {weatherData?.tomorrowWeather.forecast.forecastday[0].day.avgtemp_c}</p>
                                        <p>Wind Speed: {weatherData?.tomorrowWeather.forecast.forecastday[0].day.maxwind_kph}</p>
                                        <p>Date: {weatherData?.tomorrowWeather.location.localtime}</p>

                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <a href="https://www.weatherapi.com/" className="logo" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0" /></a>
                    </div>
                    :
                    <Loader loading={loading} />
            }
        </>
    )
}