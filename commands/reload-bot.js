/*
This command restarts the bot if using PM2 or end the node process regularly
*/

const dbObjects = require("../db/dbObjects");

module.exports = {
  name: "reload-bot",
  aliases: ["reset-bot", "restart-bot", "reboot-bot"],
  description: "Restarts the bot.",
  //   argumentDescription: "",
  roles: ["Admin", "Mod"],
  args: false,
  //   usage: "",
  guildOnly: true,
  cooldown: 10,
  category: "Utilities",
  execute(message, args) {
    dbObjects.mongoo.connection.close().then(() => {
      console.log("MongoDb connection closed.");
      process.exit();
    });
  },
};
