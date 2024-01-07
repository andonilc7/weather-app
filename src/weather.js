import {format, parseISO} from 'date-fns';

function processData(data) {
  function processDateTime () {

    if (data.location.localtime.length == 15) {
      return data.location.localtime.substring(0,11) + "0" + data.location.localtime.substring(11)
    } else {
      return data.location.localtime;
    }

  };
  const processedData = {
   location: {
     name: data.location.name,
     region: data.location.region,
     country: data.location.country,
     dateTime: processDateTime(),
     roundDateTime: processDateTime().substring(0,14) + "00",
    time: processDateTime().slice(-5),
    roundTime: processDateTime().substring(11,14) + "00"
   },
   
    current: {
     temp_f: data.current.temp_f,
     temp_c: data.current.temp_c,
     feelslike_f: data.current.feelslike_f,
     feelslike_c: data.current.feelslike_c,
     condition_text: data.current.condition.text,
     icon: `./assets/${data.current.condition.icon.substring(21)}`,
     is_day: data.current.is_day,
     wind_mph: data.current.wind_mph,
     wind_dir: data.current.wind_dir,
     humidity: data.current.humidity,
     precip_in: data.current.precip_in
    },
    forecast: {
     daily: [
       {day: format(new Date(`${parseISO(data.forecast.forecastday[0].date)}\n`), 'EEEE'),high_f: data.forecast.forecastday[0].day.maxtemp_f, low_f: data.forecast.forecastday[0].day.mintemp_f, high_c: data.forecast.forecastday[0].day.maxtemp_c, low_c: data.forecast.forecastday[0].day.mintemp_c, icon: `./assets/${data.forecast.forecastday[0].day.condition.icon.substring(21)}`},
       {day: format(new Date(`${parseISO(data.forecast.forecastday[1].date)}\n`), 'EEEE'),high_f: data.forecast.forecastday[1].day.maxtemp_f, low_f: data.forecast.forecastday[1].day.mintemp_f, high_c: data.forecast.forecastday[1].day.maxtemp_c, low_c: data.forecast.forecastday[1].day.mintemp_c, icon: `./assets/${data.forecast.forecastday[1].day.condition.icon.substring(21)}`},
       {day: format(new Date(`${parseISO(data.forecast.forecastday[2].date)}\n`), 'EEEE'),high_f: data.forecast.forecastday[2].day.maxtemp_f, low_f: data.forecast.forecastday[2].day.mintemp_f, high_c: data.forecast.forecastday[2].day.maxtemp_c, low_c: data.forecast.forecastday[2].day.mintemp_c, icon: `./assets/${data.forecast.forecastday[2].day.condition.icon.substring(21)}`},
     ],
     hourly: data.forecast.forecastday[0].hour.concat(data.forecast.forecastday[1].hour).map(function(e) {
       return {
         temp_f: e.temp_f,
         temp_c: e.temp_c,
         dateTime: e.time,
         time: e.time.slice(-5),
         icon: `./assets/${e.condition.icon.substring(21)}`
       }
     })
    }
  };
  return processedData
}

async function getData(location) {
 // const currentDataUrl = `http://api.weatherapi.com/v1/current.json?key=dc46089129e1449abfe201328240301&q=${location}`
 const forecastDataUrl = `http://api.weatherapi.com/v1/forecast.json?key=dc46089129e1449abfe201328240301&q=${location}&days=3`
 try {
   // const reponseCurrent = await fetch(currentDataUrl, {mode: 'cors'});
   // const currentData = await reponseCurrent.json();
   const responseForecast = await fetch(forecastDataUrl, {mode: 'cors'})
   const forecastData = await responseForecast.json();
   const processedData = processData(forecastData)
   console.log(processedData)
   console.log(forecastData)
   return processedData;
 } catch (error){
   console.log(error)
 }
}

export default getData