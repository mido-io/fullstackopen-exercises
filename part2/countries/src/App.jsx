import axios from "axios";
import { useState, useEffect } from 'react';

const CountryDetails = ({ country }) => {

  const api_key = import.meta.env.VITE_WEATHER_KEY
  // console.log(api_key)

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const capital = country.capital[0]

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then(res => {
        console.log(res.data)
        setWeather(res.data)
      })
  }, [country])

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      <img src={country.flags.svg} alt={country.flags.alt} width="250" />

      {
        weather && (
          <>
            <h2>Weather in {country.capital} </h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            <p>Wind {weather.wind.speed} m/s</p>
          </>
        )
      }

    </div>
  );
};

function App() {

  const [countries, setCountries] = useState([]);
  const [filterCountries, setFilterCountries] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(res => {
        console.log(res.data)
        setCountries(res.data)
      });
  }, []);

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(filterCountries.toLowerCase())
  );

  return (
    <div>
      find countries
      <input
        type="text"
        value={filterCountries}
        onChange={(e) => {
          setFilterCountries(e.target.value);
          setSelectedCountry(null);
        }}
      />

      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />

      ) : filterCountries === "" ? (
        ""
      ) : filtered.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filtered.length > 1 ? (

        filtered.map(country => (

          <p key={country.name.common}>
            {country.name.common}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </p>
        ))

      ) : filtered.length === 1 ? (

        <CountryDetails country={filtered[0]} />
      ) : null}
    </div>
  );
}

export default App;
