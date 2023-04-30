import { Inter } from "next/font/google";
import { Oswald } from "next/font/google";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });
const oswald = Oswald({ subsets: ["latin"] });

console.log(oswald);

// Declare a type for global props passed by getStaticProps
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

  // Now we have that we have the location key we can make a specific call for the weather
  const currentWeather = await axios.get(
    `http://dataservice.accuweather.com/currentconditions/v1/${locKey}?apikey=${process.env.NEXT_PUBLIC_API_KEY}`
  );

  // If the icon key is less than 10, we add prefix a 0 to match the icon URL
  let prefixNum = "";
  const iconKey = Number(currentWeather.data[0].WeatherIcon);
  if (iconKey < 10) {
    prefixNum = "0";
  }

  //  Create a reference to the icon URL
  const iconURL = `https://developer.accuweather.com/sites/default/files/${
    prefixNum + iconKey
  }-s.png`;

  const weatherText = currentWeather.data[0].WeatherText;
  const temp = Math.round(
    Number(currentWeather.data[0].Temperature.Metric.Value)
  );

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

  // TODO: Put these class strings in an array with indexes matching the icon numbers
  if (props.iconKey < 4) {
    if (props.temp > 27) {
      cssClass = "bg-sunny";
    } else {
      cssClass = "bg-fair";
    }
  } else if (props.iconKey < 7) {
    cssClass = "bg-mild";
  } else if (props.iconKey < 14) {
    cssClass = "bg-cloudy";
  }

  return (
    <main>
      <div className={"header " + cssClass}>
        <p className={"temp"}>
          {props.temp}
          <span className="degree">{"\u00B0"}</span>
        </p>
        <img
          className="weather-icon"
          src={props.iconURL}
          alt="weather-icon"
        ></img>
        <h1 className={oswald.className}>Amsterdam</h1>
        <p className={"summary " + oswald.className}>{props.weatherText}</p>
        <img className="img-background" src="/weather-bg.png"></img>
      </div>
    </main>
  );
}
