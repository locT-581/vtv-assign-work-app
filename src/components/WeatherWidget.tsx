import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoSunny, IoCloudSharp, IoRainy } from 'react-icons/io5';
import { BsCloudSunFill } from "react-icons/bs";
import { TbMist } from "react-icons/tb";
import { RiWindyFill, RiLoader2Fill } from 'react-icons/ri';
import { TbDropletHalf2Filled } from 'react-icons/tb';

interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const iconChanger = (weather: string) => {
  let iconElement: React.ReactNode;
  let iconColor: string;

  switch (weather) {
    case "Rain":
      iconElement = <IoRainy />;
      iconColor = "#ffffff";
      break;

    case "Clear":
      iconElement = <IoSunny />;
      iconColor = "#ffffff";
      break;
    case "Clouds":
      iconElement = <IoCloudSharp />;
      iconColor = "#ffffff";
      break;

    case "Mist":
      iconElement = <TbMist />;
      iconColor = "#ffffff";
      break;
    default:
      iconElement = <BsCloudSunFill />;
      iconColor = "#ffffff";
  }

  return (
    <span className="icon" style={{ color: iconColor }}>
      {iconElement}
    </span>
  );
};

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const api_key = "3ee2e809dbca30cf9c164f51eab27b41";
    const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

    const fetchCurrentWeather = async (lat: number, lon: number) => {
      const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
      const response = await axios.get(url);
      return response.data;
    };

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((currentWeather) => {
        setWeatherData(currentWeather);
        setLoading(false);
      });
    });
    

  }, []);

  return (
    <div className="text-white flex items-center justify-center h-full bg-vtv-red rounded-3xl px-8 py-8">
      {loading ? (
        <div className="flex items-center justify-center">
          <RiLoader2Fill className="animate-spin text-6xl" />
        </div>
      ) : (
        weatherData && (
          <div className="flex w-[60%] h-full">
            <div className="w-[40%] flex items-center justify-center">
              <div className="text-9xl"> {iconChanger(weatherData.weather[0].main)}</div>
            </div>
            <div className="flex flex-col w-[60%] h-full justify-between">
              <div className="w-full font-semibold h-[70%]">
                <p className="text-8xl flex items-end">{weatherData.main.temp.toFixed(0)}°C</p> {/* Sửa đổi nhiệt độ ở đây */}
              </div>
              <div className="w-full font-medium h-[30%]">
                <p className="text-3xl">{weatherData.name}</p>
              </div>
            </div>
          </div>
        )
      )}
      {!loading && (
        <div className="text-center flex w-[40%] h-2/3">
          <div className="w-full text-center font-medium">
            <div className="flex items-center text-xl justify-center">
              <TbDropletHalf2Filled className="mr-2" />
              <p>Độ ẩm</p>
            </div>
            <div className="flex justify-center">
              <p className="text-6xl">{weatherData.main.humidity}</p>
              <p className="text-l justify-end">%</p>
            </div>
          </div>
          <div className="w-full text-center font-medium">
            <div className="flex items-center text-xl justify-center">
              <RiWindyFill className="mr-2" />
              <p>Gió</p>
            </div>
            <div className="flex justify-center">
              <p className="text-6xl">{weatherData.wind.speed.toFixed(1)}</p>
              <p className="text-l justify-end">km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
