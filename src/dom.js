import iconURLHandle from "./iconUrlHandle";
import getData from "./weather";


const searchBtn = document.querySelector('.search-btn');
const searchBar = document.querySelector('.search-bar')
const toggleDegreesBtn = document.querySelector('.toggle-degrees')

const content = document.querySelector('.content')
const overview = document.querySelector('.overview')
const cityName = document.querySelector('.city-name')
const conditionText = document.querySelector('.condition-text')
const currentTemp = document.querySelector('.current-temp')
const currentHigh = document.querySelector('.current-high')
const currentLow = document.querySelector('.current-low')

const hourlyContainer = document.querySelector('.hourly-container')
const dailyContainer = document.querySelector('.daily-container')

const feelsLikeElement = document.querySelector('.feels-like')
const windElement = document.querySelector('.wind')
const humidityElement = document.querySelector('.humidity')
const precipElement = document.querySelector('.precip')

// ***** need to figure out how to approach toggling degrees setting 
// bc currently dont have the location stored somewhere if clear 
// out search bar but still want to toggle degrees *****

//also, the placement of degrees parameter in handleSearch function is probably not the right spot

let degrees = 'f';
let currentInput = "Mount Laurel"

function renderOverview(data, degrees) {
  // console.log(getData(data))
  
  cityName.textContent = data.location.name;
  conditionText.textContent = data.current.condition_text;
  if (degrees == 'f') {
    currentTemp.textContent = `${data.current.temp_f}°F`
    currentHigh.textContent = `H: ${data.forecast.daily[0].high_f}°F`
    currentLow.textContent = `L: ${data.forecast.daily[0].low_f}°F`
  } else if (degrees =="c") {
    currentTemp.textContent = `${data.current.temp_c}°C`
    currentHigh.textContent = `H: ${data.forecast.daily[0].high_c}°C`
    currentLow.textContent = `L: ${data.forecast.daily[0].low_c}°C`
  } else {
    console.log('error')
  }
}

function getNewHourlyArr(data) {
  const roundDateTime = data.location.roundDateTime;
  const startingIndex = Number(roundDateTime.substring(11,13))
  console.log(startingIndex)
  let startingTime;
  const newHourlyArr = []
  for (let i=startingIndex; i<startingIndex + 25; i++) {
    newHourlyArr.push(data.forecast.hourly[i])
  }
  console.log(newHourlyArr)
   return newHourlyArr;

}

function renderHourly(data, degrees) {
  hourlyContainer.textContent = ''
  const newHourlyArr = getNewHourlyArr(data);
  let index=0;
  newHourlyArr.forEach(obj => {
    const hourElement = document.createElement('div');
    hourElement.setAttribute('data-index', index)
    hourElement.classList.add('hour-element');
    hourlyContainer.append(hourElement);

    const time = document.createElement('div')
    time.textContent = newHourlyArr[index].time
    hourElement.append(time)
    const iconDisplay = document.createElement('img')
    const imgURL = newHourlyArr[index].icon

    iconDisplay.src = iconURLHandle(imgURL);

    hourElement.append(iconDisplay);

    const temp = document.createElement('div');
    if (degrees==='f') {
      temp.textContent = `${newHourlyArr[index].temp_f}°F`;
    } else if (degrees==='c') {
      temp.textContent = `${newHourlyArr[index].temp_c}°C`;
    } 
    hourElement.append(temp)

    index++;

    
  })
}

function renderDaily(data, degrees) {
  dailyContainer.textContent = '';
  const dailyArr = data.forecast.daily;
  let index = 0;
  dailyArr.forEach(() => {
    const dayElement = document.createElement('div')
    dayElement.classList.add('day-element')
    dailyContainer.append(dayElement);

    const dayName = document.createElement('div')
    dayName.textContent = dailyArr[index].day;
    dayElement.append(dayName)

    const iconDisplay = document.createElement('img')
    const imgURL = dailyArr[index].icon
    iconDisplay.src = iconURLHandle(imgURL);
    dayElement.append(iconDisplay);

    const dailyHLCont = document.createElement('div')
    dailyHLCont.classList.add('daily-high-low-cont')
    dayElement.append(dailyHLCont)
    const dailyHigh = document.createElement('div')
    dailyHigh.classList.add('daily-high')
    dailyHLCont.append(dailyHigh)
    const dailyLow = document.createElement('div')
    dailyLow.classList.add('daily-low')
    dailyHLCont.append(dailyLow)

    if (degrees=='f') {
      dailyHigh.textContent = `H: ${dailyArr[index].high_f}°F`
      dailyLow.textContent = `L: ${dailyArr[index].low_f}°F`
    } else if (degrees='c') {
      dailyHigh.textContent = `H: ${dailyArr[index].high_c}°C`
      dailyLow.textContent = `L: ${dailyArr[index].low_c}°C`
    }

    index++;
  })
}

function renderCurrentDetails(data, degrees) {
  if (degrees=='f') {
    feelsLikeElement.textContent = `${data.current.feelslike_f}°F`;
  } else if (degrees=='c'){
    feelsLikeElement.textContent = `${data.current.feelslike_c}°C`;
  }
  windElement.textContent = `${data.current.wind_dir} ${data.current.wind_mph} mph`
  humidityElement.textContent = `${data.current.humidity}%`
  precipElement.textContent = (data.current.precip_in) + "''"
}

async function renderEverything(data, degrees) {
  renderOverview(data, degrees)
  renderHourly(data, degrees)
  renderDaily(data, degrees)
  renderCurrentDetails(data,degrees)
}

function handleSearch() {
  async function search() {
    const input = searchBar.value;
    currentInput = input;
    // console.log( await getData(input))
    renderEverything(await getData(currentInput), degrees)
  }
  searchBtn.onclick = search;   
  searchBar.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      search();
    }
  })
  
}


async function toggleDegrees() {
  if (degrees==="f") {
    degrees = "c";
    toggleDegreesBtn.textContent = "Display °F"

  } else if (degrees==='c') {
    degrees="f";
    toggleDegreesBtn.textContent = "Display °C"
  }
  console.log('sdfds')
  renderEverything(await getData(currentInput), degrees)
}

toggleDegreesBtn.addEventListener("click", toggleDegrees)

async function pageLoad() {
  renderEverything(await getData(currentInput), degrees)
  handleSearch();
}


export default pageLoad();