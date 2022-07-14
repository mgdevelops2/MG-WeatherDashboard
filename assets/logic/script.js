const APIkey = '84179c6fa0332dafdca89f98a6f69636'; // lets add our API to a variable
const storedCities = document.querySelector('#storedCities');
const newBtn = document.createElement('button');
$(newBtn).addClass('btn btn-secondary mb-3')
let index = 1;  // creating a global for index 

const getCoordinates = (cityName) => {      //function that runs a fetch() for the url adding in the correct city, and units.

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}`)
        .then(function (data) {
            return data.json()
        })
        .then(function (data) {
            pushCoord(data);
        });
};

function pushCoord(data) {
    const cityName = document.querySelector('#cityName'); // creating a var for title
    cityName.textContent = data.name + ' - today: ' + moment().format('MM/DD'); // lets add the city name into the header

    let lat = data.coord.lat; // creating variables for lat/lon
    let lon = data.coord.lon;

    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`)
        .then(function (data) {
            return data.json()
        })
        .then(function (data) {
            fillScreen(data);
            console.log(data);
        });
};

// function to fillScreen w/ the necessary information. 
const fillScreen = (data) => {

    const curimg = document.querySelector(`#curimg`).setAttribute('src', `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);

    const curTemp = document.querySelector('#cur-temp');     //creating a var for tempText
    curTemp.textContent = `temp: ${data.current.temp} °`;    // adding the current tempinto current folder
    // console.log(temptText);
    const curWind = document.querySelector('#cur-wind');
    curWind.textContent = `wind: ${data.current.wind_speed} mph`;

    const curHumidity = document.querySelector('#cur-humidity');
    curHumidity.textContent = `humidity: ${data.current.humidity} %`;

    const curuv = document.querySelector('#cur-uv')
    curuv.textContent = ` UV Index: ${data.current.uvi}`;

    const timeStamp = document.querySelector('#timeStamp');
    timeStamp.textContent = `Last pulled: ${moment().calendar()}`;

    // lets create a loop that increases the index
    for (i = index; index < 6; i++) {
        futureCards(data);
        index++;
    };
};

// this is a function that will fill each futurecard w/ it's respective information. 
function futureCards(data) {
    let add = document.getElementById(`add${index}`); // pulling element by its card ID
    add.textContent = moment().add(`${index}`, 'days').format('ddd - MM/DD');

    let addtemp = document.querySelector(`#add${index}temp`);        // adding temp for newday. 
    addtemp.textContent = `${data.daily[`${index}`].temp.day} °`;

    let addwind = document.querySelector(`#add${index}wind`);        // adding wind for newday
    addwind.textContent = `${data.daily[`${index}`].wind_speed} mph`;

    let addhumidity = document.querySelector(`#add${index}humidity`);         // adding humidity for the newday
    addhumidity.textContent = `${data.daily[`${index}`].humidity} %`;

    let imgSrc = document.getElementById(`add${index}img`).setAttribute('src', `http://openweathermap.org/img/w/${data.daily[`${index}`].weather[0].icon}.png`);        // setting an src attribute for the image icon
};

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', function () {
    let input = document.querySelector('#userInput').value;
    getCoordinates(input);

    newBtn.textContent = input;
    storedCities.append(newBtn);
    $(newBtn).addClass('btn btn-secondary mb-3');

    // getItem
    var storedinput = JSON.parse(localStorage.getItem('city')) || [];
    // push
    storedinput.push(input);
    // setItem
    localStorage.setItem('city', JSON.stringify(storedinput));
});

// initializes the the storedbutton
function init() {
    var storedinput = JSON.parse(localStorage.getItem('city')) || [];
    console.log(storedinput);
    storedinput.forEach(storedinput => {
        var listItem = document.createElement('button');
        $(listItem).addClass(`storedBtn btn btn-secondary mb-2`);
        listItem.textContent = storedinput;
        storedCities.appendChild(listItem);
    }
    )
};
init();

// displays previous data
const storedBtn = document.querySelector('.storedBtn');

storedBtn.addEventListener('click', function () {
    // storedBtn.preventDefault();
    // console.log($(storedBtn).text());
    var input = $(storedBtn).text();
    // console.log(input);
    getCoordinates(input);
})

