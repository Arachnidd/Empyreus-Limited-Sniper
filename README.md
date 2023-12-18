# Empyreus-Roblox-Limited-Sniper
Empyreus was the #1 sniper for a short period until I had school work and totally gave up on roblox. I've decided to open source the bot since no good offers came in which I was hoping for. Don't contact me for support on this, im over with Roblox.

There may be bugs, this isnt the original, i editted it to remove the discord bot and make a bit neater so yeah there may be bugs. If there is a simple bug just contact me, but if its regarding getting proxies or help with the bot, dont expect help.

How was Empyreus so fast Proxied? It's simple! We host proxies, and we have a whopping 8,192 IPS right inside Ashburn with 0.4ms ping from Roblox. We also have multiple locations, want to learn more? Join: https://discord.gg/4A9SRR2y8E our proxies for affordable and amazing speeds!

# Requirements
1 - Don't overwhelm your pc. Use only the threads your pc can handle. Too many can kill your internet and pc.
2 - Proxies. Many suspected us to be proxyless, a part of us was, but I wont be releasing that part as its simply too overwhelming to Roblox. I reccomend using blitzproxies (https://discord.gg/4A9SRR2y8E) proxies are hosted right in Ashburn and gives the fastest speeds possible.
3 - Cookies. For list sniper, cookies are required. I was using roughly 10,000, but you can use less.
4 - A dedicated server. My specs were 64GB RAM, 30 threads.

# How To Start

1 - Install & setup nodejs: https://nodejs.org/en/download

2 - Run `npm install pm2 -g` in your console (open console, search it on your computer, on windows you can search it by pressing the windows key and search "console")

3 - Download this github and extract the files

4 - Open up config.json once extracted. This is where all the info goes. **ALL INFORMATION IS IMPORTANT, THERE IS NOTHING THAT ISNT!** Always Remember to save before you close!

5 - Once config file is setup, open up console in the file directory your in. You can easily do this by doing `cd yourfiledirectoryhere` or press the bar right beside the search bar in your files/folder and write cmd, thatll automatically open up the current directory. In the directory you want to write `npm i`

6 - After the `npm i` command is done downloading everything, you can run the projected detector. It isn't perfect, but itll do. It is in the iteminfo folder named `itemvaluer.js`. To start it up, do `node itemvaluer.js`. Itll then start valuing items. It is on an infinite loop, it will never stop, so once you think there is enough items valued you can close the console to stop it. Typically a good 2-3 hours it perfect.

7 - After running the projected detector, and you want to start the actual sniper, run `pm2 start index.js`.

8 - Enjoy ;)

# Documentation

successWebhook: Webhook where your snipes will be sent
instantBuyUnder: The price where the bot wont look at volume or rap, itll instantly buy anything under this price
failedWebhook: Webhook where your failed snipes will be sent.
updatesWebhook: Webhooks for updates, this includes price checks and errors etc...
minProfit: The minimum profit for each snipe
discordId: Your discord ID
robloxId: Your Roblox ID
minDayVolume: Minimum daily volume. To find an items minimum daily value you can visit https://www.rolimons.com
percent: The minimum percent the bot will buy items for. 30 = 30% deals, 40 = 40% deals etc...
cookie: Your .ROBLOSECURITY
pm2ID: To get this, you have to do `pm2 start index.js` and to get the id do `pm2 list`. Itll display the id. Remember to do `pm2 stop index.js` to stop the bot immidiately.
catalogSniper: Do you want catalog sniper enabled?

ListSniper -> enabled: Do you want list sniper enabled? <-- This is blazing fast, i reccomend it, it can not be outsniped :)
ListSniper -> list: Item list of what items you want to watch

# Apis im using:
`https://catalog.roblox.com/v2/search/items/details?Category=1&MinPrice=${minprice}&MaxPrice=${maxprice}&limit=120&CreatorName=ROBLOX&salesTypeFilter=2&cursor=`

`https://catalog.roblox.com/v1/search/items/details?Category=1&MinPrice=${minprice}&MaxPrice=${maxprice}&limit=30&CreatorName=ROBLOX&salesTypeFilter=2&cursor=` <-- I didn't use this, but it is pretty good.

`https://economy.roblox.com/v1/assets/${itemID}/resellers`

`https://economy.roblox.com/v1/purchases/products/${productID}`

`https://catalog.roblox.com/v1/catalog/items/details` <-- This API has a vulnerability, i have not used this api in this code just because its simply too overpowered. If you find the vulnerability, don't abuse it, Roblox will not like it. It essentially will make it unratelimitted which is really abusive, think of how you'd like it if you were in Roblox's place. I've reported the vulnerability to Roblox, but they simply do not care.

# Why Empyreus was so good
https://imgur.com/a/shDxXgx <-- Imgur album, click it to see SOME OF THE GOOD SNIPES. THESE ARE NOT ALL! Join https://discord.gg/8c6RACZxUP to see all the amazing snipes we had gotten.
