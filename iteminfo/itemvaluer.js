const fetch = require('node-fetch');
const allItems = require('./items.json');
const ProxyAgent = require('https-proxy-agent');
const consola = require('consola')
const items = allItems.items;
const proxies = require('../proxies.json').proxies;
let count = 0;
const median = arr => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };
const privinfo = require('../cookies.json');
const randomCookies = privinfo.RandomCookies;
const editJsonFile = require("edit-json-file");
const async = require('async');

setInterval(function() {
    let proxyRandomizer = proxies[Math.floor(Math.random() * proxies.length)];
    let agent = ProxyAgent('http://' + proxyRandomizer)
    if (count < items.length) {
                let item = items[count]
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${Math.round(averages)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                        
                                    } else if (median(allData) <= 95) {
                                        consola.success(item, " is a small, valued at: 30")
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `30`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${Math.round(-(parseFloat(lowest) * 0.35) + parseFloat(lowest))}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200' && reseller >= '100') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${Math.round(-(parseFloat(reseller) * 0.35) + parseFloat(reseller))}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${Math.round(-(parseFloat(lowest) * 0.35) + parseFloat(lowest))}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) * 0.07 + parseFloat(median(allData)) >= rap && price * 0.03 + parseFloat(price) >= median(allData)){
                                        consola.info(item, 'was not valued at ', median(allData), "it has a median higher than the rap and the price is more than the rap")
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${Math.round(-(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData)))}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, "might be projected, not valued")
                                    }
                            }
                            }).catch(err => console.log(err))
                            count++
                            reseller = ''
                            rap = ''
                            averages = ''
                            lowest = ''
                            allData = ''
                        } else {
                            count = 0
                            reseller = ''
                            rap = ''
                            averages = ''
                            lowest = ''
                            allData = ''
                        }
}, 10)
/*
async.parallel({
    task1: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task2: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task3: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task4: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task5: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task6: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task7: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task8: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task9: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
    task10: function(){
        setTimeout(function() {
            function printFiles () {
               for (const item of items) {
                let reseller = ''
                let rap = ''
                let averages = ''
                let lowest = ''
                let allData = ''
                let cookieRandomizer = Math.floor(Math.random() * randomCookies.length);
                let randomCookie = `.ROBLOSECURITY=${randomCookies[cookieRandomizer]}`;
                 fetch (`https://economy.roblox.com/v1/assets/${item}/resale-data`, {
                    method: 'GET',
                    agent
                }).then(response => response.json()).then(json => {
                    if (json.priceDataPoints[9]) {
                        allData = json.priceDataPoints.slice(0, 9).map(a => a.value)
                        lowest = Math.min(...allData)
                        averages = -(parseFloat(median(allData)) * 0.35) + parseFloat(median(allData));
                        rap = json.recentAveragePrice;
                    } else {
                        consola.warn(item, 'Item does not have enough data, so it was not valued.')
                    }
                }).catch(err => {})
                         fetch(`https://economy.roblox.com/v1/assets/${item}/resellers`, {
                            method: 'GET',
                            agent,
                            headers: {
                                cookie : randomCookie,
                                'Content-Type': 'appication/json'
                            } 
                            }).then(response2 => response2.json()).then(json2 => {
                                if (json2.data[0].price >= '0.5') {
                                    reseller = json2.data[0].price;
                                    if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) >= median(allData) && reseller * 0.06 + parseFloat(reseller) >= rap) {
                                        consola.success(item, median(allData))
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${averages}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) <= '600' && reseller >= '200') {
                                        consola.success(item, 'is under 600 but price is above 200 so valued at:' ,lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (reseller <= '200') {
                                        consola.info(item, 'is worth less than 200, so valued at:', reseller)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(reseller) * 0.35) + parseFloat(reseller)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else if (median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= median(allData) && reseller >= lowest || median(allData) >= '600' && reseller * 0.06 + parseFloat(reseller) <= rap && reseller >= lowest) {
                                        consola.error(item, 'might be projected! Valued at:', lowest)
                                        let file = editJsonFile(`${__dirname}/rap.json`);
                                        file.set(`${item}`, `${-(parseFloat(lowest) * 0.35) + parseFloat(lowest)}`);
                                        file.save();
                                        file = editJsonFile(`${__dirname}/rap.json`), {
                                            autosave: true
                                        };
                                    } else {
                                        consola.warn(item, 'was not valued! It was inflated too much.')
                                    }
                                }
                            }).catch(err => console.log(err))
                }
            }
            printFiles()
            setInterval(function() {
                printFiles()
            }, 1800000)
        }, 0)
    },
        function(err, results) {
            console.log(results);
            // results now equals to: { task1: 1, task2: 2 }
        }
          });
          */