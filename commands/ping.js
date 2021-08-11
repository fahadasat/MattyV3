/*
This command sends a simple message to check if the bot is active
*/

module.exports = {
  name: "ping",
  aliases: ["test"],
  description: "Use to check if bot is active.",
  //   argumentDescription: "",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: false,
  cooldown: 1,
  category: "Info",
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
