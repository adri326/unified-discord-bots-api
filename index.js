const rp = require("request-promise-native");
const events = require("events");

const default_settings = {
  interval: 5*60*1000
}


class DiscordBots extends events.EventEmitter {
  constructor(settings) {
    super(settings);
    Object.assign(this, settings, default_settings);

    if (this.interval && this.interval > 0) {
      clearInterval(this.interval);
    }

    if (Array.isArray(this.websites) || this.url) {
      (this.websites || [this]).forEach(website => {
        if (website.url) {
          let parsed;
          if (parsed = /^(?:(?:https?:)?\/\/)?([\w\.\-_]+)\/?$/.exec(website.url)) { // If the given url does not have a `path`
            website.url = "https://" + parsed[1] + "/api";
          }
        }
      });
    }

    if (this.interval > 0) {
      this.interval = setInterval(this.update.bind(this), this.interval);
      this.update();
    }

    return this;
  }

  update() {
    if (Array.isArray(this.websites) || this.url) {
      (this.websites || [this]).forEach((website, id) => {
        this.postStats(website).then(_ => {
            this.emit("success", _);
          })
          .catch(_ => {
            this.emit("error", _);
          });
      });
    }
  }

  getBots(website) {
    return this.request(website, {
      method: "GET",
      url: "/bots"
    })
  }

  getInfo(website) {
    return this.request(website, {
      method: "GET",
      url: "/bots/:id"
    })
  }

  getStats(website) {
    return this.request(website, {
      method: "GET",
      url: "/bots/:id/stats"
    });
  }

  postStats(website) {
    return this.request(website, {
      method: "POST",
      url: "/bots/:id/stats"
    })
  }

  request(_website, settings) {
    let website = _website;
    if (this.websites && this.websites[_website]) website = this.websites[website];

    let client = this.client || website.client || {user: {}, guilds: {}};

    const _request = (resolve, reject) => {
      let url = (website.url || _website).replace(/\/$/, "");
      let botID = website.id || client.user.id;
      let sc = website.server_count || client.guilds.size;
      let token = website.token;

      if (url && botID && typeof sc != "undefined" && token) {
        let options = {
          method: settings.method,
          uri: url + settings.url.replace(/:id|:bot_user_id/g, botID),
          body: {
              "server_count": sc
          },
          headers: {
              'Authorization': token
          },
          json: true
        };

        rp(options).then(output => {
          if (output) {
            if (typeof output == "object") {
              resolve(output);
            }
            else if (typeof output == "string") {
              resolve(JSON.parse(output));
            }
          }
          else {
            reject(new Error("No answer"));
          }
        }).catch(reject);
      }
      else {
        if (!website) reject(new Error("No website given!"));
        if (!client && !botID) reject(new Error("No client nor bot ID!"));
        if (!client && !sc && sc !== 0) reject(new Error("No client nor valid server count!"));
        if (!url) reject(new Error("Invalid URL"));
        if (!botID) reject(new Error("Invalid bot ID"));
        if (!sc && sc !== 0) reject(new Error("Invalid server count"));
        if (!token) reject(new Error("Invalid token"));
      }
    };

    return new Promise(_request);
  }
};

module.exports = DiscordBots;
