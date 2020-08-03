const dotenv = require('dotenv');
dotenv.config();

const schedule = require('node-schedule');

const Discord = require('discord.js');
const client = new Discord.Client();

const targetCronTable = "* * * * *";    // every min

let User;
let job;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if(msg.content.startsWith('준비')){
    User = msg.author;
    job = schedule.scheduleJob(targetCronTable, function(){
      User.send("test");
    });
  }
  else if(msg.content.startsWith('그만')){
    job.cancel();
  }
});


client.login(config.token)