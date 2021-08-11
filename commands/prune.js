/*
This command will prune the messages in a range of 2-100
*/

module.exports = {
  name: "prune",
  aliases: ["deletemessages", "deletemessage", "prunemessage"],
  description: "Prunes 2-100 messages from the channel",
  argumentDescription: "Give a valid number of messages to prune.",
  roles: ["Admin", "Mod", "Helpers"],
  args: true,
  usage: "[number of messages]",
  guildOnly: true,
  cooldown: 10,
  category: "Utilities",
  execute(message, args) {
    if (isNaN(args[0])) {
      return message.reply("That doesn't seem to be a valid number.");
    } else if (args[0] < 2 || args[0] > 100) {
      return message.reply("You need to input a number between 2 and 100.");
    }
    message.channel.bulkDelete(args[0]);
  },
};
