/*
Made by: Arachnid (spiderphobias) <-- Contact on discord
Name: Noor
Uploaded: 12/17/2023
Last Updated: 11/15/2023
*/
const cluster = require('cluster');
const fetch = require('node-fetch');
const fs = require('fs');
const editJsonFile = require('edit-json-file')
const child = require('child_process')
let configurationfile = require('./config.json')
let discordId = configurationfile.GeneralInfo.discordId
const starterCookie = configurationfile.GeneralInfo.cookie
let userId = configurationfile.GeneralInfo.robloxId
const updateWebhook = configurationfile.GeneralInfo.successWebhook
let config = {}
let errored = false
let robux = 0

// Function to display Empyreus Snipe Bot in big characters
console.log(`
███████╗███╗░░░███╗██████╗░██╗░░░██╗██████╗░███████╗██╗░░░██╗░██████╗
██╔════╝████╗░████║██╔══██╗╚██╗░██╔╝██╔══██╗██╔════╝██║░░░██║██╔════╝
█████╗░░██╔████╔██║██████╔╝░╚████╔╝░██████╔╝█████╗░░██║░░░██║╚█████╗░
██╔══╝░░██║╚██╔╝██║██╔═══╝░░░╚██╔╝░░██╔══██╗██╔══╝░░██║░░░██║░╚═══██╗
███████╗██║░╚═╝░██║██║░░░░░░░░██║░░░██║░░██║███████╗╚██████╔╝██████╔╝
╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝░╚═════╝░╚═════╝░

█░░ █ █▀▄▀█ █ ▀█▀ █▀▀ █▀▄   █▀ █▄░█ █ █▀█ █▀▀ █▀█
█▄▄ █ █░▀░█ █ ░█░ ██▄ █▄▀   ▄█ █░▀█ █ █▀▀ ██▄ █▀▄
Made by: Arachnid (spiderphobias) / Noor`)

// Function to display "Made by: Arachnid (spiderphobias) / Noor"
setTimeout(async function () {
  console.log(config)
  await fetch('https://auth.roblox.com/v1/logout', {
    headers: {
      cookie: '.ROBLOSECURITY=' + starterCookie
    },
    method: 'POST',
    body: '{}'
  })
    .then((res) => {
      //console.log(res.status)
      if (res.status !== 401) {
        let xcsrf = res.headers.get('x-csrf-token') || 'errored';
        //console.log('xcsrf:', xcsrf);
        let file = editJsonFile(`${__dirname}/config.json`);
        file.set("xcsrf", `${xcsrf}`);
        file.save();
        file = editJsonFile(`${__dirname}/config.json`, {
          autosave: true
        });
      } else {
        //console.log('errored')
        errored = true
      }
    })
    .catch((err) => { });
  if (await errored == false) {
    await fetch(`https://www.roblox.com/mobileapi/userinfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'cookie': '.ROBLOSECURITY=' + starterCookie
      }
    }).then(res => res.json()).then(json => {
      robux = json.robux
      let file = editJsonFile(`${__dirname}/config.json`);
      file.set("robux", json.RobuxBalance)
      file.set("robloxId", json.UserID)
      userId = json.UserID
      file.save();
      file = editJsonFile(`${__dirname}/config.json`, {
        autosave: true
      });
      fetch(`${updateWebhook}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "content": `<@${discordId}> Started Bot!`,
          "embeds": [
            {
              "type": "rich",
              "title": `Welcome ${json.UserName}`,
              "description": `Your bot has been started! **PLEASE NOTE:** You will be notified when your cookie invalidates. ALSO PLEASE CHECK THE FOLLOWING! IF ANY OF THE BELOW ARE MISSING YOUR BOT WILL ERROR!\n\n:white_check_mark: Logged in as: ${json.UserName}\n<:discord:1121556005038333982> Discord User: <@${discordId}>\nSuccess Webhook: ${updateWebhook}\n:coin: Robux Balance: ${json.RobuxBalance}`,
              "color": 1752220,
              "thumbnail": {
                "url": `${json.ThumbnailUrl}`
              }
            }
          ]
        })
      }).catch(err => { })
    }).catch(err => { })
    async function getConfig() {
      setInterval(function () {
        fs.readFile(`./config.json`, 'utf-8', (err, data) => {
          if (err) { /*console.log(err)*/ }
          try {
            let parsed = JSON.parse(data)
            config = parsed
          } catch (err) {
            //console.log("parent", err)
          }
        })
      }, 5000)
    }
    getConfig()
    // Global variable
    async function getCSRF() {
      await fetch('https://auth.roblox.com/v1/logout', {
        headers: {
          cookie: '.ROBLOSECURITY=' + starterCookie
        },
        method: 'POST',
        body: '{}'
      })
        .then((res) => {
          if (res.status !== 401) {
            let xcsrf = res.headers.get('x-csrf-token') || 'errored';
            //console.log('xcsrf:', xcsrf);
            let file = editJsonFile(`${__dirname}/config.json`);
            file.set("xcsrf", `${xcsrf}`);
            file.save();
            file = editJsonFile(`${__dirname}/config.json`, {
              autosave: true
            });
          } else {
            fetch(updateWebhook, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "content": `<@${discordId}> Error!`,
                "embeds": [
                  {
                    "type": "rich",
                    "title": `**ERROR!**`,
                    "description": `There was an error starting your bot! Please try again, if this presists double check your config and cookie!`,
                    "color": 10038562,
                  }
                ]
              })
            }).catch(err => { })
            child.exec(`pm2 stop ${configurationfile.GeneralInfo.pm2ID}`)
          }
        })
        .catch((err) => { });
      setTimeout(function () {
        getCSRF()
      }, 10000)
    }
    getCSRF()
    async function getRobux() {
      await fetch(`https://economy.roblox.com/v1/users/${userId}/currency`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'cookie': `.ROBLOSECURITY=${starterCookie}`
        }
      }).then(res => res.json()).then(json => {
        robux = json.robux
        let file = editJsonFile(`${__dirname}/config.json`);
        file.set("robux", robux)
        file.save();
        file = editJsonFile(`${__dirname}/config.json`, {
          autosave: true
        });
      }).catch(err => { })
      setTimeout(function () {
        getRobux()
      }, 120000)
    }
    getRobux()
  } else {
    fetch(updateWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "content": `<@${discordId}> Error!`,
        "embeds": [
          {
            "type": "rich",
            "title": `**ERROR!**`,
            "description": `There was an error starting your bot! Please try again, if this presists double check your config and cookie!`,
            "color": 10038562,
          }
        ]
      })
    }).catch(err => { })
    child.exec(`pm2 stop ${configurationfile.GeneralInfo.pm2ID}`)
  }
  if (configurationfile.GeneralInfo.catalogSniper) {
    child.exec('cd CatalogSniper && node catalogsniper.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
  if (configurationfile.ListSniper.enabled) {
    child.exec('cd ListSniper && node listParent.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
}, 1000)