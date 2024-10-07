const searchBtn=document.getElementById("search-btn");
const currLocationBtn=document.getElementById("currLocationBtn");
const input=document.getElementById("input");
const weatherCardsBox=document.getElementById("weatherCards");
const currWatherBox=document.getElementById("currWatherBox");
const API_KEY="b3d4525c525bc608772d7cf56dabd5a9";

const weatherCard=(cityName,weatherItem, index)=>{
    // console.log(weatherItem.dt_txt.split(" ")[0]);
    if(index===0){
        return `
            <div class="align-top" id="details">
                <h3 class="text-white text-2xl font-bold">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                <h4 class="text-white text-xl ">Temperature: ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
                <h4 class="text-white text-xl">Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4 class="text-white text-xl">Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="h-[100%]" id="icon">
                <img class="w-40 bg-transparent" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-img">
                <h4 class="text-white text-lg text-center">${weatherItem.weather[0].description}</h4>
            </div>
        `;
    }else{
        return `
            <div id="weatherCard" class="mb-6 bg-gray-400 inline-block  py-4 px-2 rounded-md w-[25%]">
                <h3 class="text-white text-2xl font-bold mb-5" >(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img class="mb-4 w-[30%] " src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-img">
                <h4 class="text-white text-xl ">Temperature: ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
                <h4 class="text-white text-xl">Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4 class="text-white text-xl">Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
        `;
    }
}

const weatherDetails=(cityName, lat, lon)=>{
    const weatherAPI=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    // console.log("weatherDetails");
    
    fetch(weatherAPI)
        .then(res=>res.json())
        .then(data=>{
            console.log("data weatherAPI ",data)
            const forcastDays=[];
            const fiveDaysForcastData=data.list.filter(forcast=>{
                const forcastDate=new Date(forcast.dt_txt).getDate();
                if(!forcastDays.includes(forcastDate)){
                    return forcastDays.push(forcastDate);
                }
            })
            input.value="";
            weatherCardsBox.innerHTML="";
            currWatherBox.innerHTML="";

            console.log("fiveDaysForcastData==", fiveDaysForcastData);
            fiveDaysForcastData.forEach((weatherItem, index)=>{
                if(index===0){
                    currWatherBox.insertAdjacentHTML("beforeend", weatherCard(cityName,weatherItem, index))
                }else[
                    weatherCardsBox.insertAdjacentHTML("beforeend", weatherCard(cityName,weatherItem, index))
                ]
                
                console.log("hi");
                
            })
            
        })
        .catch((err)=> alert("Error in fetching weatherAPI"));
}

const getCityDetails=()=>{
    const cityName=input.value.trim();
    if(!cityName) return alert("Enter City Name")
    
    const api=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    
    fetch(api)
        .then(res=>res.json())
        .then(data=>{
            // console.log(data);
            if(data.length==0){
                return alert(`data not available for ${cityName}`);
            }
            const {name, lat, lon}=data[0];
            weatherDetails(name, lat, lon);
        })
        .catch((err)=> alert("Error in fetching"));
    
    
    
}

const currLocationBtnDetails=()=>{
    navigator.geolocation.getCurrentPosition(
        position=>{
            const {latitude, longitude}=position.coords;
            const reverseAPI=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            fetch(reverseAPI)
                .then(res=>res.json())
                .then(data=>{
                    console.log(data);
                    const {name}=data[0];
                    weatherDetails(name, latitude, longitude);
                    
                })
                .catch((err)=> alert("Error in fetching"));

                    console.log(position);
                    
                },
        err=>{
            if(err.code===err.PERMISSION_DENIED){
                alert("reset location")
            }
            console.log(err);
            
        }
    )
}

searchBtn.addEventListener('click', getCityDetails)
currLocationBtn.addEventListener('click', currLocationBtnDetails)
input.addEventListener('keyup',e=>e.key==="Enter" && currLocationBtnDetails())
