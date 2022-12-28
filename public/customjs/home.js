const apiURL = "https://api.openweathermap.org/data/2.5/weather?lat=31.2304&lon=121.4737&appid=01291c05158c386155ba767bde03e1fb";
const serverRootURL = "https://smartrackapi.adaptable.app";

let delay = 0;
const userMsg = "Your clothes have been dried!";
let parsedData;
let countingDown = false;

const refreshButton = document.querySelector("#refresh");
const logs = document.querySelector("#data");

// functions
// ========================================================================================================
const getWeather = async()=>{
    const data = await fetch(apiURL);
    parsedData = await data.json();

    console.log(parsedData.name);
    console.log(parsedData.main.temp);
}

const displayElems = ()=>{
    // creates a div here
    const rootContainerDiv = document.createElement("div");
    rootContainerDiv.classList.add("card");

    const containerDiv = document.createElement("div");
    containerDiv.classList.add("card-body");

    // create the content
    const locationName = document.createElement("h3");
    locationName.innerText = `Location: ${parsedData.name}`;

    const temperatureName = document.createElement("p");
    temperatureName.innerText = `Temperature: ${parsedData.main.temp}`;

    const humidityName = document.createElement("p");
    humidityName.innerText = `Humidity: ${parsedData.main.humidity}`;

    const pressureName = document.createElement("p");
    pressureName.innerText = `Pressure: ${parsedData.main.pressure}`;

    // append to the container
    containerDiv.appendChild(locationName);
    containerDiv.appendChild(temperatureName);
    containerDiv.appendChild(humidityName);
    containerDiv.appendChild(pressureName);

    // append to the root div in HTML
    rootContainerDiv.appendChild(containerDiv);
    logs.appendChild(rootContainerDiv);
}

const delayFunc = async ()=>{
    informUser();
    // enable the button again
    refreshButton.disabled = false;
    const updateServer = await fetch(`${serverRootURL}/userCall/False`);
    const parsedUpdateServer = await updateServer.json();
    console.log(`task is finished! server message: ${parsedUpdateServer.message}`);
}

const informUser = ()=>{
    // create div
    const rootContainerDiv = document.createElement("div");
    rootContainerDiv.classList.add("card");
    rootContainerDiv.classList.add("mb-2")

    const containerDiv = document.createElement("div");
    containerDiv.classList.add("card-body");

    // create the elem
    const notif = document.createElement("h5");
    notif.innerText = userMsg;
    
    // append the children to root div...
    containerDiv.appendChild(notif);
    rootContainerDiv.appendChild(containerDiv);
    logs.appendChild(rootContainerDiv);
}

const countDelay = (temperature, humidity)=>{
    let time = 2;
    let multiplier = 1;
    let month = new Date();
    let hour = new Date();
    let getmonth = month.getMonth();
    let gethour = hour.getHours();
    let temp = temperature;
    let humid = humidity;

    if(gethour >= 17 || gethour <= 6){
        multiplier += 0.2;
    }

    if(getmonth == 1 || getmonth >= 11){
        time = time * 1.5;
    }
    else if(getmonth >= 9 && getmonth <= 11){
        time = time * 1.1;
    }
    else{
    }

    for(i = 294; i >= temp; i--){
        multiplier += 0.05;
    }
    for(j = 75; j <= humid; j++){
        multiplier += 0.01;
    }   
   // time = time * (multiplier) * 3600000;
    time = Math.round(time * (multiplier) * 15000);
    console.log(time);

    return time;
}

//const informServer

const startRoutine = async()=>{

    if(!countingDown){
        countingDown = true;
        refreshButton.disabled = true; // to prevent user from clicking multiple times
        // fetch data on the weather in shanghai
        await getWeather();

        // calculates the delay we want
        //delay = calculateDelay();
        delay = countDelay(parsedData.main.temperature, parsedData.main.humidity);

        // display the data obtained
        displayElems();

        // begin counting, then tell the user the clothes has been dried
        const updateServer = await fetch(`${serverRootURL}/userCall/True`);
        const parsedUpdateServer = await updateServer.json();
        console.log(`task begins! server message: ${parsedUpdateServer.message}`);
        await setTimeout(delayFunc, delay);
        // update the server dealing with arduino (do this inside the delayFunc)

        countingDown = false;
    }
    else{
        alert("The clothes are not dried yet!");
    }
}

// DOM objects
// ========================================================================================================
refreshButton.addEventListener("click", function(){startRoutine()});



// cron job
// ========================================================================================================
//setInterval(getWeather, 5000);
getWeather();