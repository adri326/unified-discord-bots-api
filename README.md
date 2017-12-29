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

* **websites**: an array of websites to which the stats of the bot will be sent to, these are formatted as following: `{url: "<url>", token: "<the token for this website>"}`. *required*
* **interval**: the interval for which the library will automatically send the stats of the bot. *optional*
