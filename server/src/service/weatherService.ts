import dotenv from 'dotenv';
dotenv.config();

class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
 baseURL='https://api.openweathermap.org/data/2.5'
  API_KEY=process.env.API_KEY
  cityName=""


    async fetchLocationData(query: string) {
      const APIURL=`${this.baseURL}/forecast?${query}&appid=${this.API_KEY}`
      console.log(APIURL)
      const locationRes=await fetch(APIURL)
      const locationResjson=await locationRes.json()
      return locationResjson
    }

  
    async getWeatherForCity(city: string) {
      const cityNameEncode=encodeURIComponent(city)
      const APIURL=`${this.baseURL}/weather?q=${cityNameEncode}&appid=${this.API_KEY}`
      const cityRes=await fetch(APIURL)
      const cityResJson=await cityRes.json()
      console.log(cityResJson)
      // console.log(APIURL)
      this.cityName=cityNameEncode
      if (cityResJson.cod === 200)
      {
        const locationQuery = `lat=${cityResJson.coord.lat}&lon=${cityResJson.coord.lon}`
        const locationResJson = await this.fetchLocationData(locationQuery)
        console.log(locationResJson)
        if (locationResJson.cod === "200"){
          const weatherResponse = {
            current: cityResJson, forecast: locationResJson
  
          }
          return weatherResponse
        }
        else {
          return {
            current: cityResJson, forecast: null
          }
        }
        
      }
      return {
        current: null, forecast: null
      }
    }
}

export default new WeatherService();
