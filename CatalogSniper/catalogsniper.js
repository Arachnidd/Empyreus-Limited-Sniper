const child = require('child_process');
const { fork } = child
const fetch = require('node-fetch')
const config = require('../config.json')
const fs = require('fs')
let count1 = 0;
let count2 = 0;
let count3 = 0;
let count4 = 0;
let count5 = 0;
let count6 = 0;
let count7 = 0;
let count8 = 0;
let count9 = 0;
let count10 = 0;
let count11 = 0;
let count12 = 0;
let count13 = 0;
let count14 = 0;
let count15 = 0;
let count16 = 0;
let count17 = 0;
let count18 = 0;
let count19 = 0;
let count20 = 0;
let count21 = 0;
let count22 = 0;
let count23 = 0;
let count24 = 0;
let childProcesses = [];
const startThread = async (path, count) => {
    return new Promise(resolve => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                let child = fork(path);
                childProcesses.push(child);
                //console.log("Thread", i, "started. Total workers now:", childProcesses.length);
                if (i === count - 1) {
                    resolve();
                }
            }, i * 1000);
        }
    });
};
(async () => {
    await startThread("./under250.js", 3);
    await startThread("./250to500.js", 2);
    await startThread("./500to900.js", 2);
    await startThread("./900to1400.js", 2);
    await startThread("./1401to2000.js", 1);
    await startThread("./2000to2700.js", 2);
    await startThread("./2700to3300.js", 4);
    await startThread("./3300to4000.js", 4);
    await startThread("./4000to4950.js", 2);
    await startThread("./4950to5999.js", 1);
    await startThread("./6000to7200.js", 2);
    await startThread("./7200to8500.js", 1);
    await startThread("./8500to9999.js", 1);
    await startThread("./10000to12000.js", 1);
    await startThread("./12000to14999.js", 2);
    await startThread("./15000to19999.js", 2);
    await startThread("./20000to27500.js", 1);
    await startThread("./27500to40000.js", 2);
    await startThread("./40000to70000.js", 3);
    await startThread("./70000to130000.js", 3);
    await startThread("./130000to300000.js", 2);
    await startThread("./300000to1000000.js", 1);
    await startThread("./1000000to100000000.js", 1);
    //await startThread("./above100000000.js", 1);
    childProcesses.forEach((child, index) => {
        child.on('message', (message) => {
            if (message.buying) {
                childProcesses.forEach((child) => {
                    child.send({ item: message.buying });
                });
            } else if (message.lowest) {
                count1++
            } else if (message.c250) {
                count2++;
            } else if (message.c500) {
                count3++;
            } else if (message.c900) {
                count4++;
            } else if (message.c1400) {
                count5++;
            } else if (message.c2000) {
                count6++;
            } else if (message.c2700) {
                count7++;
            } else if (message.c3300) {
                count8++;
            } else if (message.c4000) {
                count9++;
            } else if (message.c4950) {
                count10++;
            } else if (message.c6000) {
                count11++;
            } else if (message.c7200) {
                count12++;
            } else if (message.c8500) {
                count13++;
            } else if (message.c10000) {
                count14++;
            } else if (message.c12000) {
                count15++;
            } else if (message.c15000) {
                count16++;
            } else if (message.c20000) {
                count17++;
            } else if (message.c27500) {
                count18++;
            } else if (message.c40000) {
                count19++;
            } else if (message.c70000) {
                count20++;
            } else if (message.c130000) {
                count21++;
            } else if (message.c300000) {
                count22++;
            } else if (message.c1000000) {
                count23++;
            } else if (message.above10000000) {
                count24++;
            }
        });
    });
})();
setInterval(function () {
    const total = count1 + count2 + count3 + count4 + count5 + count6 + count7 + count8 + count9 + count10 + count11 + count12 + count13 + count14 + count15 + count16 + count17 + count18 + count19 + count20 + count21 + count22 + count23 + count24
    fetch(`${config.GeneralInfo.updatesWebhook}`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            "content": `Catalog Update:\nCount1: \`${count1}\` (Total: \`${count1 * 120}\`)\nCount2: \`${count2}\` (Total: \`${count2 * 120}\`)\nCount3: \`${count3}\` (Total: \`${count3 * 120}\`)\nCount4: \`${count4}\` (Total: \`${count4 * 120}\`)\nCount5: \`${count5}\` (Total: \`${count5 * 120}\`)\nCount6: \`${count6}\` (Total: \`${count6 * 120}\`)\nCount7: \`${count7}\` (Total: \`${count7 * 120}\`)\nCount8: \`${count8}\` (Total: \`${count8 * 120}\`)\nCount9: \`${count9}\` (Total: \`${count9 * 120}\`)\nCount10: \`${count10}\` (Total: \`${count10 * 120}\`)\nCount11: \`${count11}\` (Total: \`${count11 * 120}\`)\nCount12: \`${count12}\` (Total: \`${count12 * 120}\`)\nCount13: \`${count13}\` (Total: \`${count13 * 120}\`)\nCount14: \`${count14}\` (Total: \`${count14 * 120}\`)\nCount15: \`${count15}\` (Total: \`${count15 * 120}\`)\nCount16: \`${count16}\` (Total: \`${count16 * 120}\`)\nCount17: \`${count17}\` (Total: \`${count17 * 120}\`)\nCount18: \`${count18}\` (Total: \`${count18 * 120}\`)\nCount19: \`${count19}\` (Total: \`${count19 * 120}\`)\nCount20: \`${count20}\` (Total: \`${count20 * 120}\`)\nCount21: \`${count21}\` (Total: \`${count21 * 120}\`)\nCount22: \`${count22}\` (Total: \`${count22 * 120}\`)\nCount23: \`${count23}\` (Total: \`${count23 * 120}\`)\nCount24: \`${count24}\` (Total: \`${count24 * 120}\`)\nChecks: \`${total}\` Total: \`${total * 120}\` catalog checks in 1 min.`
        })
    }).catch(err => { console.log(err) })
    if (total < 9000000) {
        child.exec(`pm2 restart ${config.GeneralInfo.pm2ID}`)
    } else {
        count1 = 0;
        count2 = 0;
        count3 = 0;
        count4 = 0;
        count5 = 0;
        count6 = 0;
        count7 = 0;
        count8 = 0;
        count9 = 0;
        count10 = 0;
        count11 = 0;
        count12 = 0;
        count13 = 0;
        count14 = 0;
        count15 = 0;
        count16 = 0;
        count17 = 0;
        count18 = 0;
        count19 = 0;
        count20 = 0;
        count21 = 0;
        count22 = 0;
        count23 = 0;
        count24 = 0;
    }
}, 60000)