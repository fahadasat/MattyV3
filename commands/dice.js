/*
This command will a number of dice rolls
*/

module.exports = {
  name: "dice",
  aliases: ["dice-roll", "rolldice"],
  description: "Gives you a dice roll",
  argumentDescription: "The number of dice you want to roll.",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[number]",
  guildOnly: false,
  cooldown: 0.1,
  category: "Fun",
  execute(message, args) {
    if (!args.length) {
      message.channel.send(Math.floor(Math.random() * 6) + 1);
    } else {
      if (isNaN(args[0])) {
        return message.reply("That doesn't seem to be a valid number.");
      } else if (args[0] < 2 || args[0] > 20) {
        return message.reply("You need to input a number between 2 and 20.");
      }
      for (let i = 0; i < args[0]; i++) {
        message.channel.send(Math.floor(Math.random() * 6) + 1);
      }
    }
  },
};
