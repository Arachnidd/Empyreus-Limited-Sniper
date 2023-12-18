const fetch = require('node-fetch')
const ProxyAgent = require('https-proxy-agent')
const cookies = require('../cookies.json').RandomCookies
const rap = require('../iteminfo/rap.json')
const list = require('../config.json').list
const productId = require('../iteminfo/looking.json')
let usersJSON = {}
let count = 0
let parsed = {}
let users = []
let isRunning = false;
let latency = []
let checks = 0
let queue = {}
let usersArray = []
const proxies = require('../proxies.json').proxies
let allRobux = {}
let userssArrayy = []
let dontBuy = ''
const fs = require('fs')
//let isRunning = false;
fs.readFile('../config.json', 'utf-8', (err, data) => {
    if (err) { }
    try {
        let thisJSON = JSON.parse(data);
        if (thisJSON.users.length >= 1) {
            usersJSON = thisJSON
        } else { }
    } catch (err) { }
})
function tgetImageUrl(itemId, itemPrice, itemName, successWebhook, discordId) {
    const agent = ProxyAgent('http://user:pass@dc1.ca.blitzproxies.com:8080') //Use blitzproxies for the lowest latency
    fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${itemId}&size=420x420&format=Png&isCircular=false`, {
        agent,
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json()).then(json => {
        let imageUrl = json.data[0].imageUrl
        tsendWebhook(itemId, itemPrice, itemName, imageUrl, successWebhook, discordId)
    }).catch(err => {
        setTimeout(function () {
            tgetImageUrl(itemId, itemPrice, itemName, successWebhook, discordId)
        }, 5000)
    })
}
function tsendWebhook(itemId, itemPrice, itemName, imageUrl, successWebhook, discordId) {
    let totalProfit = rap[itemId] / 0.7 - itemPrice
    let colour = ''
    if (totalProfit >= 700 && totalProfit <= 2999) {
        colour = 7419530
    } else if (totalProfit >= 3000) {
        colour = 12745742
    } else {
        colour = 1752220
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
function fgetName(itemId, itemPrice, reason, failedWebhook) {
    const agent = ProxyAgent('http://user:pass@dc1.ca.blitzproxies.com:8080') //Use blitzproxies for the lowest latency
    fetch(`https://catalog.roblox.com/v1/catalog/items/${itemId}/details?itemType=Asset`, {
        agent,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(json1 => {
        let itemName = json1.name
        console.log(itemName)
        fgetImageUrl(itemId, itemPrice, reason, itemName, failedWebhook)
    }).catch(err => {
        console.log(err)
        setTimeout(function () {
            fgetName(itemId, itemPrice, reason, failedWebhook)
        }, 5000)
    });
}
async function fgetImageUrl(itemId, itemPrice, reason, itemName, failedWebhook) {
    const agent = ProxyAgent('http://user:pass@dc1.ca.blitzproxies.com:8080') //Use blitzproxies for the lowest latency
    await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${itemId}&size=420x420&format=Png&isCircular=false`, {
        agent,
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json()).then(json => {
        let imageUrl = json.data[0].imageUrl
        console.log(imageUrl)
        fsendWebhook(itemId, itemPrice, reason, itemName, imageUrl, failedWebhook)
    }).catch(err => {
        //console.log(err)
        setTimeout(function () {
            fgetImageUrl(itemId, itemPrice, reason, itemName, failedWebhook)
        }, 5000)
    })
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
async function listSniper() {
    //if (isRunning == false) {
    isRunning = true
    //count++
    try {
        isRunning = true;
        let canAfford = []
        let discordId = ''
        const itemRandomizer = list[Math.floor(Math.random() * list.length)]
        let userconfig = usersJSON
        let proxyRandomizer = proxies[Math.floor(Math.random() * proxies.length)]
        let agent = ProxyAgent('http://' + proxyRandomizer)
        let randomCookie = cookies[Math.floor(Math.random() * cookies.length)]
        //console.log("true")
        let time = Date.now()
        await fetch('https://economy.roblox.com/v1/assets/' + itemRandomizer + '/resellers', {
            agent,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': '.ROBLOSECURITY=' + randomCookie
            }
        }).then(res => res.json()).then(json => {
            let latencies = Date.now() - time
            //console.log(Date.now() - time, itemRandomizer, json.data[0].price, userconfig.discordId)
            if (json.data[0].price <= 10 && dontBuy !== itemRandomizer || json.data[0].price <= rap[itemRandomizer] && dontBuy !== itemRandomizer) {
                console.log('GOOD DEAL FOUND:', itemRandomizer, json.data[0].price)
                process.send({ buying: itemRandomizer });
                fetch("https://economy.roblox.com/v1/purchases/products/" + productId[itemRandomizer], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'cookie': ".ROBLOSECURITY=" + userconfig.GeneralInfo.cookie,
                        'x-csrf-token': userconfig.BotHandlers.xcsrf,
                        'roblox-machine-id': 'CHI2-WEB4284',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                    },
                    body: JSON.stringify({
                        expectedSellerId: json.data[0].seller.id,
                        expectedCurrency: 1,
                        expectedPrice: json.data[0].price,
                        UserAssetId: json.data[0].userAssetId
                    })
                }).then(res => res.json()).then(body => {
                    console.log(userconfig.BotHandlers.xcsrf, body)
                    if (body.purchased === true) {
                        tgetImageUrl(itemRandomizer, json.data[0].price, body.assetName, userconfig.GeneralInfo.successWebhook)
                        //isRunning = false
                    } else {
                        fgetName(itemRandomizer, json.data[0].price, body.reason, userconfig.GeneralInfo.failedWebhook)
                        //isRunning = false
                    }
                }).catch(err => {
                    //isRunning = false
                    console.log(err)
                    //isRunning = false
                    //setImmediate(listSniper)
                    return
                })
            }
            checks++
            latency.push(latencies)
            //isRunning = false
            //setImmediate(listSniper)
            return
        }).catch(err => {
            //isRunning = false
            //console.log(err)
            //isRunning = false
            //setImmediate(listSniper)
        })
    } catch (err) {
        //isRunning = false
        console.log(err)
        //isRunning = false
        //setImmediate(listSniper)
        return
    }
    isRunning = false
    //console.log("completed request #" + count)
    //} else {
    //setImmediate(listSniper)
    //return
    //}
}
process.on('message', (message) => {
    dontBuy = parseFloat(message)
    //console.log(`Received dont buy value: ${message}`);
    setTimeout(function () {
        dontBuy = ''
    }, 2000)
});
setInterval(function () {
    fs.readFile('../config.json', 'utf-8', (err, data) => {
        if (err) { }
        try {
            let thisJSON = JSON.parse(data);
            if (thisJSON.users.length >= 1) {
                usersJSON = thisJSON
            } else { }
        } catch (err) { }
    })
}, 10000)

setInterval(function () {
    process.send({ dataReceived1: true, checks: checks, latency: latency })
    checks = 0
    latency = []
}, 5000)

setInterval(function () {
    if (isRunning == false) {
        isRunning = true
        listSniper()
    }
}, 200)