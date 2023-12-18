const cluster = require('cluster');
const config = require('../config.json')
let threadCount = 0
let midLatency = []
const fetch = require('node-fetch')
const child = require('child_process')
const fs = require('fs')
let checkLow = false
const editJsonFile = require('edit-json-file');
let count1 = 0
if (cluster.isMaster) {
  for (let i = 0; i < 400; i++) {//change this! I used 400 threads because I have 3,000 concurrent connections, you won't!
    setTimeout(function () {
      threadCount++;
      cluster.fork({ script: './list.js', workerId: threadCount });
    }, i * 50); // This will increase the delay by 50ms for each iteration.
  }
  cluster.on('message', (worker, message) => {
    // Update checks when data is received
    if (message.buying) {
      console.log(message.buying)
      for (const worker of Object.values(cluster.workers)) {
        try {
          worker.send(message.buying);
        } catch (err) {
          console.log("parent", err)
        }
      }
    }
    else if (message.dataReceived1) {
      //catalogChecks++
      count1 = count1 + parseFloat(message.checks)
      //console.log(message.latency)
      let parsedLatencies = message.latency.map(value => parseFloat(value));
      //console.log(parsedLatencies)
      midLatency.push(...parsedLatencies)
      //console.log(midLatency)
      //console.log(catalogChecks * 120);
      //console.log(`Checks: ${checks}`);
    }
  });

  // Handle thread exits and create new threads to maintain the count
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Thread ${worker.process.pid} died`);
    /*if (threadCount < 1000) {
      setTimeout(function() {
        cluster.fork();
        threadCount++;
      }, 50)
    }*/
  });
  function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b); // Sort the array
    const middle = Math.floor(sorted.length / 2);

    // If the array length is odd, return the middle number
    if (sorted.length % 2 === 1) {
      return sorted[middle];
    }

    // If the array length is even, return the average of the two middle numbers
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  function average(arr) {
    let sum = arr.reduce((a, b) => a + b, 0);
    return Math.round(sum / arr.length);
  }
  setInterval(function () {
    //console.log(midLatency)
    fetch(`${config.GeneralInfo.updatesWebhook}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "content": `\`${count1}\` list checks in 1 min\nMidian Latency: ${median(midLatency)}ms\nAverage Latency: ${average(midLatency)}`
      })
    }).catch(err => { })
    if (count1 < 70000 && checkLow == true) {//Change this! I limitted myself to 3,000 concurrent connections. Unless you buy or have 3,000 concurrent requests change this or remove it entirely!
      child.exec(`pm2 restart ${config.GeneralInfo.pm2ID}`)
    } else {
      count1 = 0
      midLatency = []
    }
  }, 60000)
} else {
  const script = process.env.script;
  const workerId = process.env.workerId;
  console.log(`Thread ${workerId} started`);
  require(script);
}

setTimeout(function () {
  checkLow = true
}, 120000)