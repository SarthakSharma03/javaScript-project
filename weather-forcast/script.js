const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFoundSection = document.querySelector('.error-message')
const searchCitySecton = document.querySelector('.search-message')
const weatherInfoSection = document.querySelector('.weather-info ')
const countryTxt = document.querySelector('.city-text')
const tempTxt = document.querySelector('.temperature-icon')
const conditionTxt = document.querySelector('.condition-txt')
const  humidityValue = document.querySelector('.humidity-value')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.city-date')
const forecastItem = document.querySelector('.forcast')




  const apiKey='97312338c41ffd35d636fe0b87ca95fb'

searchBtn.addEventListener('click' , ()=>{
    if(cityInput.value.trim() !=''){
       
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
       
    }
})
cityInput.addEventListener('keydown' ,(event)=>{
    if(event.key == 'Enter' && 
        cityInput.value.trim() !=''
    ){
         updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
   
})
 async function getFetchDate( endPoint , city){
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric
`
const respone =  await fetch(apiUrl)
return respone.json()
} 

function getweatherIcon(id){
     if (id <=232) return 'thunderstorm.svg'
     if (id <=321) return 'drizzle.svg'
     if (id <=531) return 'rain.svg'
     if (id <=622) return 'snow.svg'
     if (id <=781) return 'atmosphere.svg'
     if (id <=800) return 'clear.svg'
     else return 'clouds.svg'
}
function getCurrentDate(){
    const currentDate =new Date()
    const options = {
        weekday:'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB' , options)
}
 async function updateWeatherInfo(city){
    const weatherDate =  await getFetchDate('weather', city)

    if(weatherDate.cod !=200){
        showDisplaySection()
        return
    }
    console.log(weatherDate)
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main: weatherMain }],
        wind: { speed }
    } = weatherDate

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' C'
    conditionTxt.textContent = weatherMain
    humidityValue.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'
    currentDateTxt.textContent = getCurrentDate()

    weatherSummaryImg.src = `./${getweatherIcon(id)}`

    await updateForcastsInfo(city)


    showDisplaySection(city)
}
 async function updateForcastsInfo(city){
        const forcastsData = await getFetchDate('forecast' , city)
        const timeTaken =  '12:00:00'
        const todayDate = new Date().toISOString().split('T')[0]
        forecastItem.innerHTML=''
        forcastsData.list.forEach(forecastWeather =>{
            if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate) ){
                 updateForecastItems(forecastWeather)
                console.log(forecastWeather)
            }
        })

}
function updateForecastItems(weatherDate){
        console.log(weatherDate)
        const{
            dt_txt:date,
            weather:[{id }],
            main:{temp}

        }=weatherDate
            const dateTaken =new Date( date)
            const dateOption = {
                day:'2-digit',
                month:'short'
            }
            const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

        const forecastItemHTML  = `
          <div class="forcast-info">
                <h3>${dateResult}</h3>
                <img src="./${getweatherIcon(id)}" alt="">
                <h3>${Math.round(temp)}<i class="fa-solid fa-temperature-high"></i> </h3>
            </div>`

            forecastItem.insertAdjacentHTML('beforeend', forecastItemHTML)
}
function showDisplaySection(city){
    if(!city){
    weatherInfoSection.style.display ='none'
    searchCitySecton.style.display ='none'
    notFoundSection.style.display ='block'
    return    
    }
  if (city !=''){
    weatherInfoSection.style.display ='block'
    searchCitySecton.style.display ='none'
    notFoundSection.style.display ='none'
  } 
  
 

}