/*
This command will a number of coin flips
*/

module.exports = {
  name: "coinflip",
  aliases: ["coin-flip", "flip-coin", "flip"],
  description: "Gives you a coinflip.",
  argumentDescription: "The number of coins you want to flip.",
  // roles: ["Admin", "Mod", "Student"],
  args: false,
  usage: "[number]",
  guildOnly: false,
  cooldown: 5,
  category: "Fun",
  execute(message, args) {
    if (!args.length) {
      coin = Math.floor(Math.random() * 2) == 0;
      if (coin) {
        message.channel.send("heads");
      } else {
        message.channel.send("tails");
      }
    } else {
      if (isNaN(args[0])) {
        return message.reply("That doesn't seem to be a valid number.");
      } else if (args[0] < 2 || args[0] > 20) {
        return message.reply("You need to input a number between 2 and 20.");
      }
      for (let i = 0; i < args[0]; i++) {
        if (Math.random() < 0.5) {
          message.channel.send("heads");
        } else {
          message.channel.send("tails");
        }
      }
    }
  },
};
