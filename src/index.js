const dotenv = require('dotenv');
dotenv.config();

const schedule = require('node-schedule');
const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client();

const targetCronTable = "* * * * *";    // every min



let job;
let location;
let lat, lon;

const message = "하이";

function getCoord(location){
  const locationURI = encodeURI(location);
  return axios.get(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${locationURI}`,
    {headers: {
        Authorization: `KakaoAK ${process.env.kakaoAPIKey}`
      }
    }
  )
  .then((response) => {
      console.log(response.data);
      lon = response.data.documents[0].address.x;
      lat = response.data.documents[0].address.y;

    },
    (error) => {
      console.log(error);
    }
  );
}

function getWeather(){
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.weatherAPIKey}`;

  return axios.get(url)
  .then((response) => {
      // console.log(response.data);
      return response.data;
    },
    (error) => {
      console.log("error :", error);
    }
  );
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if(msg.content === "인사"){
    msg.author.send(message);
  }

  // 그만하기
  else if(msg.content.startsWith('그만')){
    job.cancel();
    msg.author.send("취소되었습니다");
  }

  // 위치설정 -> 위치 서그내로23-9
  else if(msg.content.split(' ')[0] === '위치'){
    location = msg.content.split(' ')[1];
    await getCoord(location);
    console.log("location :", location);
    console.log("lat :", lat);
    console.log("lon :", lon);
    msg.author.send(`위치가 ${location}으로 설정되었습니다.`);
  }

  // 시작하기
  else if(msg.content === '시작'){
    job = schedule.scheduleJob(targetCronTable, async function(){
      if(location){
        let weatherData = await getWeather();
        msg.author.send(location +"의 날씨는 " + String(weatherData.weather[0].main) + " 입니다.");
        msg.author.send(location +"의 기온은 " + String(Math.floor(weatherData.main.temp - 273)) + "도 입니다.");
      }
      else{
        msg.author.send('위치 정보를 먼저 정해주세요');
      }
    });
  }
});

client.login(process.env.token)
