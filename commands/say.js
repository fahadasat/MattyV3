/*
This command will repeat what the user said
*/

module.exports = {
  name: "say",
  aliases: ["repeat"],
  description: "Repeats after you.",
  argumentDescription: "Anything you want repeated.",
  // roles: ["Admin", "Mod", "Student"],
  args: true,
  usage: "[Anything]",
  guildOnly: false,
  cooldown: 5,
  category: "Misc",
  execute(message, args) {
    message.channel.send(args.join(" "));
  },
};
