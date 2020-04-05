const DiscordJS = require('discord.js');
const Message = require('../bot/Message');

module.exports = class Discord {
  constructor({ token, botId }) {
    this.token = token;
    this.botId = botId;
    this.subs = [];
  }

  connect() {
    this.client = new DiscordJS.Client();
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on('message', (msg) => {
      if (msg.author.id === this.botId) return;

      this.publish(
        new Message({
          id: msg.id,
          user: {
            id: msg.author.id,
            name: msg.author.username,
          },
          content: msg.content,
          chatId: msg.channel.id,
          createdAt: msg.createdTimestamp,
        }),
      );
    });
    this.client.login(this.token);
  }

  subscribe(cb) {
    this.subs.push(cb);
  }

  publish(message) {
    this.subs.forEach((sub) => sub(message));
  }
};