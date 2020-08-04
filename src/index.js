const dotenv = require('dotenv');
dotenv.config();

const schedule = require('node-schedule');

const Discord = require('discord.js');
const client = new Discord.Client();

const targetCronTable = "* * * * *";    // every min

let job;

const message = "하이";
function timeMessage(){
  return `지금 시각은 ${Date.now()} 입니다.`
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  
  if(msg.content === "인사"){
    msg.author.send(message);
  }
  else if(msg.content.startsWith('시간')){
    job = schedule.scheduleJob(targetCronTable, function(){
      msg.author.send(`지금 시각은 ${timeMessage()} 입니다.`);
    });
  }
  else if(msg.content.startsWith('그만')){
    job.cancel();
  }
  else if(msg.content === '테스트'){
    msg.author.send('테스트');
  }
});

client.login(process.env.token)