const fetch = require('node-fetch')
const ProxyAgent = require('https-proxy-agent')
const agent = ProxyAgent('http://user:pass@dc1.ca.blitzproxies.com:8080')//Blitz Proxy #1
const fs = require('fs')
const cookies = require('./check.json').cookies
let inJSON = {}
let validCookies = []
let validCount = 0
console.log("Loaded", cookies.length, "cookies...")

setTimeout(function () {
    function writeValidCookieToFile(cookie) {
        fs.appendFile('/root/snipeManager/Staff/validCookies.txt', cookie + '\n', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    
    async function checkCookies() {
        for (let i = 0; i < cookies.length; i) {
            //console.log("Making request");
            try {
                const res = await fetch(`https://economy.roblox.com/v1/assets/102606672/resellers`, {
                    agent,
                    headers: {
                        'Content-Type': 'application/json',
                        'cookie': '.ROBLOSECURITY=' + cookies[i]
                    }
                });
                const json = await res.json();
                //console.log(json);
    
                if (json?.errors && json.errors[0]?.message == "Unauthorized") {
                    console.log("Invalid Cookie");
                    i++;
                } else if (json.data && json.data[0].price > 1) {
                    //validCookies.push(cookies[i]);
                    validCount++;
                    console.log("Total Valid Cookies:", validCount, "out of", i++);
                    writeValidCookieToFile(cookies[i]);
                } else {
                    i
                }
            } catch (err) {
                //console.log(err);
                i
            }
        }
    }
    checkCookies()
}, 5000)
/*
setInterval(async function() {
    inJSON.cookies = validCookies;
    //console.log(inJSON)
    fs.writeFile('/root/snipeManager/Staff/validd.json', await JSON.stringify(inJSON), function (err, data) {
        if (err) {
            console.log(err)
        }
    });
}, 5000)*/