const superagent = require('superagent')
const https = require('https');
const fetch = require('node-fetch')
const rap = require('../iteminfo/volume.json')
const fs = require('fs')
const proxy = require('superagent-proxy')(superagent);
//const cookies = require('./privinfo.json').RandomCookies
const proxyUrl = 'http://user:pass@dc1.us.blitzproxy.com:8080';//Obviously im not giving you guys free proxies. A good proxy provider is blitzproxy.com, check them out: https://discord.gg/4A9SRR2y8E
const volume = require("../iteminfo/volume.json")
const url = "https://catalog.roblox.com/v2/search/items/details?Category=1&MinPrice=1401&MaxPrice=2000&limit=120&CreatorName=ROBLOX&salesTypeFilter=2&cursor="
const minRobux = parseFloat(url.substring(url.indexOf("MinPrice=") + 9, url.indexOf("&MaxPrice=")))
let count = 0
let dontBuy = ""
let fileContent;
fileContent = fs.readFileSync("../config.json", 'utf8');
const requestOptions = {
  hostname: 'economy.roblox.com',
  port: 443,  // Adjust port if necessary
  localAddress: 'yourIP',  // Your IP Address. I used this before because one of my ips had gotten banned, and ofc I have many others, so i used one is specific.
};
const agent = new https.Agent(requestOptions);
let isreseller = ""
let jsonData = JSON.parse(fileContent);
process.on('message', (message) => {
  dontBuy = message.item
  //console.log(`Received dont buy value: ${message}`);
  setTimeout(function () {
    dontBuy = ''
  }, 1500)
});
async function tgetImageUrl(itemId, itemPrice, itemName, successWebhook, discordId) {
  fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${itemId}&size=420x420&format=Png&isCircular=false`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json()).then(json => {
    let imageUrl = json.data[0].imageUrl
    if (imageUrl?.length > 2) {
      tsendWebhook(itemId, itemPrice, itemName, imageUrl, successWebhook, discordId)
    } else {
      setTimeout(function () {
        tgetImageUrl(itemId, itemPrice, itemName, successWebhook, discordId)
      }, 5000)
    }
  }).catch(err => {
    setTimeout(function () {
      tgetImageUrl(itemId, itemPrice, itemName, successWebhook, discordId)
    }, 5000)
  })
}
async function tsendWebhook(itemId, itemPrice, itemName, imageUrl, successWebhook, discordId) {
  let totalProfit = rap[itemId] / 0.7 - itemPrice;
  let colour = '';
  if (totalProfit >= 700 && totalProfit <= 2999) {
    colour = 7419530;
  } else if (totalProfit >= 3000) {
    colour = 12745742;
  } else {
    colour = 1752220;
  }
  fetch(`${successWebhook}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "content": `<@${discordId}>`,
      "embeds": [
        {
          "title": `${itemName}`,
          "url": `https://www.rolimons.com/item/${itemId}`,
          "description": `:coin: **Price:** \`${itemPrice}\`\n**Deal Percent:**\`${Math.round((1 - itemPrice / (parseFloat(rap[itemId]) / 0.7)) * 100)}%\`\n:money_mouth: **Profit:** \`${parseFloat(rap[itemId]) / 0.7 - itemPrice}\``,
          "color": colour,
          "thumbnail": {
            "url": `${imageUrl}`
          }
        }
      ]
    })
  }).catch(err => { console.log(err) })
}
async function fgetImageUrl(itemId, itemPrice, reason, itemName, failedWebhook) {
  await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${itemId}&size=420x420&format=Png&isCircular=false`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json()).then(json => {
    let imageUrl = json.data[0].imageUrl
    if (imageUrl?.length > 2) {
      fsendWebhook(itemId, itemPrice, reason, itemName, imageUrl, failedWebhook)
    } else {
      setTimeout(function () {
        fgetImageUrl(itemId, itemPrice, reason, itemName, failedWebhook)
      }, 5000)
    }
  }).catch(err => {
    setTimeout(function () {
      fgetImageUrl(itemId, itemPrice, reason, itemName, failedWebhook)
    })
  }, 5000)
}
function fsendWebhook(itemId, itemPrice, reason, itemName, imageUrl, failedWebhook) {
  fetch(`${failedWebhook}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "content": "Missed Snipe",
      "embeds": [
        {
          "title": `${itemName}`,
          "url": `https://www.rolimons.com/item/${itemId}`,
          "description": `**Price:** \`${itemPrice}\`\n**Deal Percent:**\`${Math.round((1 - itemPrice / (parseFloat(rap[itemId]) / 0.7)) * 100)}%\`\n**Profit:** \`${parseFloat(rap[itemId]) / 0.7 - itemPrice}\`\n**Reason:**\`\`\`${reason}\`\`\``,
          "color": 10038562,
          "thumbnail": {
            "url": `${imageUrl}`
          }
        }
      ]
    })
  }).catch(err => { })
}
async function get() {
  //let cookieRandomizer = cookies[Math.floor(Math.random() * cookies.length)]
  const headers = {
    'Content-Type': 'application/json'
  };
  let beforeRequest = await Date.now()
  //console.log(await config)
  //if (await config !== "No Users") {
  await superagent.get(url).proxy(proxyUrl).set(headers).end(async (err, res) => {
    if (err) {
      if (!err.message.includes("Too Many") && !err.message.includes("Internal Server") && !err.message.includes("socket hang") && !err.message.includes("Client network") && !err.message.includes("Bad Gateway") && !err.message.includes("aborted")) {
        console.log(err.message)
      }
    } else {
      json = res.body
      for (const item of json.data) {
        try {
          let itemID = item.id
          let productID = item.productId
          let price = item.lowestPrice
          let config = await jsonData
          //console.log(config.percent)
          //count++
          //console.log(count++, Date.now() - beforeRequest, item.lowestPrice, item.id);
          if (price <= 10 && item.itemRestrictions[0].includes("Limited") && dontBuy !== itemID || price <= (rap[item.id] / 0.7) * (1 - (await config.GeneralInfo.percent / 100)) && await config.GeneralInfo.minDayVolume <= volume[item.id] && item.itemRestrictions[0].includes("Limited") && dontBuy !== itemID || itemID !== dontBuy && await config.GeneralInfo.instantBuyUnder >= price && item.itemRestrictions[0].includes("Limited") || itemID !== dontBuy && parseFloat(rap[itemID]) >= 85000 && price <= (rap[item.id] / 0.7) * (1 - (await config.GeneralInfo.percent / 100))) {
            dontBuy = itemID
            console.log("found item:", itemID, price)
            if (isreseller !== itemID) {
              isreseller = itemID
              superagent.get("https://economy.roblox.com/v1/assets/" + item.id + "/resellers").agent(agent).set("cookie", ".ROBLOSECURITY=" + await config.GeneralInfo.cookie).end((err, res3) => {
                if (err) {
                  console.log(err.message)
                } else {
                  json1 = res3.body
                  if (json1.data[0].price == price) {
                    //process.send({buying: itemID});
                    let startBuyTime = Date.now()
                    let uaid = json1.data[0].userAssetId
                    let seller = json1.data[0].seller.id
                    let buyheaders = {
                      expectedSellerId: seller,
                      expectedCurrency: 1,
                      expectedPrice: price,
                      UserAssetId: uaid
                    }
                    superagent.post("https://economy.roblox.com/v1/purchases/products/" + productID).agent(agent).send(buyheaders).set('Content-Type', 'application/json').set('cookie', ".ROBLOSECURITY=" + config.GeneralInfo.cookie).set("x-csrf-token", config.BotHandlers.xcsrf).end((err, res2) => {
                      if (err) {
                        console.log(err.message)
                      } else {
                        lastjson = res2.body
                        console.log(config.GeneralInfo.discordId, Date.now() - startBuyTime, lastjson)
                        if (res2.body.purchased == true) {
                          tgetImageUrl(item.id, item.lowestPrice, item.name, config.GeneralInfo.successWebhook, config.GeneralInfo.discordId)
                          dontBuy = ""
                          isreseller = ""
                        } else {
                          fgetImageUrl(item.id, item.lowestPrice, res2.body.reason, item.name, config.GeneralInfo.failedWebhook)
                          dontBuy = ""
                          isreseller = ""
                        }
                      }
                    })
                  } else {
                    console.log("price change")
                    fgetImageUrl(item.id, item.lowestPrice, "price changed", item.name, config.GeneralInfo.failedWebhook)
                    dontBuy = ""
                    isreseller = ""
                  }
                }
              })
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
      process.send({ c1400: true })
    }
    get()
  })
  /*} else {
      console.log("No Users")
  }*/
}
for (let i = 0; i < 20; i++) {
  setTimeout(function () {
    get()
  }, 221)
}

setInterval(async function () {
  let fileContent = await fs.readFileSync("../config.json", 'utf8');
  try {
    jsonData = await JSON.parse(await fileContent);
  } catch { }
}, 7000)