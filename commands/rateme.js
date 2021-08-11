/*
This command will send a rating to the user
*/

module.exports = {
  name: "rateme",
  aliases: ["rate"],
  description: "Gives you a rating.",
  //   argumentDescription: "",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  //   usage: "",
  guildOnly: false,
  cooldown: 5,
  category: "Fun",
  execute(message, args) {
    message.reply(
      "** you are a " + Math.floor(Math.random() * 11).toString() + "/10!**"
    );
  },
};
