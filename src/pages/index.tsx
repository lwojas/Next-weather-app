import { Inter } from "next/font/google";
import { Oswald } from "next/font/google";
import axios from "axios";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });

console.log(oswald);

type globalProps = {
  iconURL: string;
  iconKey: number;
  temp: number;
  weatherText: string;
};

export async function getStaticProps() {
  const res = await axios.get(
    `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.NEXT_PUBLIC_API_KEY}&q=Amsterdam`
  );
  const locKey = Number(res.data[0].Key);
  const currentWeather = await axios.get(
    `http://dataservice.accuweather.com/currentconditions/v1/${locKey}?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  let prefixNum = "";
  const iconKey = Number(currentWeather.data[0].WeatherIcon);
  const weatherText = currentWeather.data[0].WeatherText;
  const temp = Math.round(
    Number(currentWeather.data[0].Temperature.Metric.Value)
  );
  if (iconKey < 10) {
    prefixNum = "0";
  }
  const iconURL =
    "https://developer.accuweather.com/sites/default/files/" +
    prefixNum +
    iconKey +
    "-s.png";
  return {
    props: {
      iconURL,
      iconKey,
      temp,
      weatherText,
    },
  };
}

export default function Home(props: globalProps) {
  console.log(props.iconKey, props.temp);
  let cssClass = "index";
  if (props.iconKey < 4) {
    cssClass = "bg-sunny";
  } else if (props.iconKey < 7) {
    cssClass = "bg-mild";
  } else if (props.iconKey < 14) {
    cssClass = "bg-cloudy";
  }
  // const [iconURL, setIconURL] = useState("");

  // useEffect(() => {
  //   async function testAPI() {
  //     const res = await axios.get(
  //       "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=WnJH297aKw0AMBgmsQ24MrdD3f0m7sKs&q=Amsterdam"
  //     );
  //     const locKey = Number(res.data[0].Key);
  //     const currentWeather = await axios.get(
  //       `http://dataservice.accuweather.com/currentconditions/v1/${locKey}?apikey=WnJH297aKw0AMBgmsQ24MrdD3f0m7sKs`
  //     );
  //     const iconKey = currentWeather.data[0].WeatherIcon;
  //     setIconURL(
  //       "https://developer.accuweather.com/sites/default/files/" +
  //         iconKey +
  //         "-s.png"
  //     );
  //     console.log(currentWeather.data[0], iconURL);
  //   }
  //   testAPI();
  // }, []);

  return (
    <main>
      <div className={"header " + cssClass}>
        <p className={"temp"}>
          {props.temp}
          <span className="degree">{"\u00B0"}</span>
        </p>
        <h1 className={oswald.className}>Amsterdam</h1>
        <p className={"summary " + oswald.className}>{props.weatherText}</p>
        <img
          className="weather-icon"
          src={props.iconURL}
          alt="weather-icon"
        ></img>
        <img className="img-background" src="/weather-bg.png"></img>
      </div>
    </main>
  );
}
