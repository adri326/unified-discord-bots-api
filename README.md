# unified-discord-bots-api
An unified (and fixed) version of the discord-bots-api for NodeJS, which supports plural websites (e.g discordbots.org or bots.discord.pw)


## Usage

First, import this repository in npm:
```json
dependencies: {
  "unified-discord-bots-api": "https://github.com/adri326/unified-discord-bots-api.git"
}
```

Then, execute `npm install unified-discord-bots-api` and import the library in NodeJS using ```js
var udb_api = require("unified-discord-bots-api");```

To use the library, create an instance of it with, as argument, a JS Object. This object has a couple values:

* **websites**: an array of websites to which the stats of the bot will be sent to, it is an object, with, as properties:
  * **url**: the URL of the website, if no path on the website is given, it will automatically use `/api` as path, *required*
  * **token**: the token for the website, *required* (by most websites)
  * **client**: the client to use for this website, useful for having different clients for every website *obtional*
  * **server_count**: the server count to send to the website, overrides the global server_count *optional*
  * **id**: the ID to use for the website, overrides the global ID *optional*
* **interval**: the interval for which the library will automatically send the stats of the bot. *optional*
* **client**: the client that will be used to query the ID and server count, *required* or *optional* when the next two properties are given
* **server_count**: the server count for the bot that will be sent to every website, *optional*
* **id**: the ID of the bot, *optional*

For example:
```js
const udb_api = require("unified-discord-bot-api");
const Discord = require("discord.js");
var client = new Discord.Client();
client.login("<your discord token>");

var udb_client = new udb_api(
  {
    websites: [
      {
        url: "bots.discord.pw",
        token: "<your bots.discord.pw token>"
      },
      {
        url: "discordbots.org",
        token: "<discordbots.org's token for this bot>"
      }
    ],
    client
  });
```
