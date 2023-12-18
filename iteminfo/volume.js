const fetch = require('node-fetch')
const fs = require('fs')
const ProxyAgent = require('https-proxy-agent')
const items = require('./items.json').items
const proxies = require('./proxies.json').proxies
const editJsonFile = require('edit-json-file')
let count = 0;

// pre-setup
fs.writeFile('./daily.json', '{}', (err) => {if (err) {console.log(err)}})
fs.writeFile('./month.json', '{}', (err) => {if (err) {console.log(err)}})


async function editJSON(filename,key,value){
   const raw = await fs.promises.readFile(filename,'utf-8',(err) => {if (err) {console.log(err)}})
   let data = JSON.parse(raw)
   data[key] = value
   const tosend = JSON.stringify(data)
   await fs.promises.writeFile(filename,tosend,(err) => {if (err) {console.log(err)}})
}
setInterval(function() {
    if (count <= items.length) {
        let item = items[count]
        const date = new Date() - 2629800000
        let proxyRandomizer = proxies[Math.floor(Math.random() * proxies.length)];
        let agent = ProxyAgent('http://' + proxyRandomizer)
        fetch(`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
            method: 'GET',
            agent,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            if (data?.volumeDataPoints?.length > 1) {
                let thirtyDayVol = 0
                for (const volume of data.volumeDataPoints) {
                    let dateConversion = new Date(`${volume.date}`).getTime()
                    if (dateConversion >= date) {
                        thirtyDayVol = thirtyDayVol + volume.value
                    }
                }
                //daily
                let file = editJsonFile(`/root/snipeManager/Staff/volume.json`);
                file.set(`${item}`, `${Math.round((thirtyDayVol / 30) * 100.00) / 100.00}`);
                file.save();
                file = editJsonFile(`/root/snipeManager/Staff/volume.json`), {
                    autosave: true
                }
                //monthly
                count++
            } else {
                console.log(item, "does not have enough data")
                count++
            }
        }).catch(err => {console.log("error")})
    } else {
        count = 0
    }
}, 10)